import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const cronSecret = Deno.env.get('CRON_SECRET');

function normalizePage(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async request => {
  if (!supabaseUrl || !serviceRoleKey || !cronSecret) {
    return new Response('Missing server configuration', { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: sources, error } = await supabase
    .from('regulatory_sources')
    .select('id,title,source_url,audience,last_content_hash')
    .eq('active', true);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const results = [];
  for (const source of sources ?? []) {
    try {
      const response = await fetch(source.source_url, {
        headers: { 'user-agent': 'XpressIntra rule monitor/1.0' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentHash = await sha256(normalizePage(await response.text()));
      const changed = Boolean(source.last_content_hash && source.last_content_hash !== contentHash);

      if (changed) {
        await supabase.from('regulatory_updates').insert({
          source_id: source.id,
          audience: source.audience,
          title: `Mulig regelændring: ${source.title}`,
          summary: 'Den overvågede kilde er ændret. Gennemgå siden og skriv en kort medarbejderbesked før godkendelse.',
          status: 'draft',
        });
      }

      await supabase
        .from('regulatory_sources')
        .update({ last_checked_at: new Date().toISOString(), last_content_hash: contentHash })
        .eq('id', source.id);

      results.push({ source: source.title, changed });
    } catch (error) {
      results.push({ source: source.title, error: error instanceof Error ? error.message : String(error) });
    }
  }

  return Response.json({ checked: results.length, results });
});
