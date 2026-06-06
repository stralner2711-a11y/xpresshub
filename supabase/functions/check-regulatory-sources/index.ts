import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const cronSecret = Deno.env.get('CRON_SECRET');

const topicLabels: Record<string, string> = {
  transport: 'transportændring',
  gdpr: 'GDPR-ændring',
  terms: 'ændring i brugsvilkår',
  privacy: 'ændring i privatliv/databehandling',
  technology: 'teknologiændring',
  operations: 'driftsændring',
};

const topicSummaries: Record<string, string> = {
  transport: 'Den overvågede transportkilde er ændret. Gennemgå siden og skriv en kort driftsbesked før godkendelse.',
  gdpr: 'Den overvågede GDPR-kilde er ændret. Vurder om persondata, compliance eller medarbejderinformation skal opdateres.',
  terms: 'De overvågede brugsvilkår er ændret. Vurder om app-brug, leverandørvilkår eller intern godkendelse skal opdateres.',
  privacy: 'Den overvågede privacy-kilde er ændret. Vurder om databehandling, privatlivstekst eller leverandørforhold skal opdateres.',
  technology: 'Den overvågede teknologikilde er ændret. Vurder om integrationer eller arbejdsgange påvirkes.',
  operations: 'Den overvågede driftskilde er ændret. Vurder om planlægning eller intern information skal opdateres.',
};

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
    .select('id,title,source_url,audience,topic,last_content_hash')
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
        const topic = source.topic || 'transport';
        const { data: existingUpdate, error: existingError } = await supabase
          .from('regulatory_updates')
          .select('id')
          .eq('source_id', source.id)
          .eq('content_hash', contentHash)
          .maybeSingle();

        if (existingError) throw existingError;

        if (!existingUpdate) {
          const { error: insertError } = await supabase.from('regulatory_updates').insert({
            source_id: source.id,
            audience: source.audience,
            topic,
            content_hash: contentHash,
            title: `Mulig ${topicLabels[topic] || 'ændring'}: ${source.title}`,
            summary: topicSummaries[topic] || topicSummaries.transport,
            status: 'draft',
          });
          if (insertError) throw insertError;
        }
      }

      await supabase
        .from('regulatory_sources')
        .update({ last_checked_at: new Date().toISOString(), last_content_hash: contentHash })
        .eq('id', source.id);

      results.push({ source: source.title, topic: source.topic || 'transport', changed });
    } catch (error) {
      results.push({
        source: source.title,
        topic: source.topic || 'transport',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return Response.json({ checked: results.length, results });
});
