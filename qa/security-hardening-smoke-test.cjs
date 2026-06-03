const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const publicServiceWorker = fs.readFileSync('public/service-worker.js', 'utf8');
const netlify = fs.readFileSync('netlify.toml', 'utf8');
const vercel = fs.readFileSync('vercel.json', 'utf8');
const publicConfig = fs.readFileSync('public/app-config.js', 'utf8');
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
const securityDoc = fs.readFileSync('docs/SECURITY_HARDENING.md', 'utf8');

assert(!/onerror\s*=/.test(app), 'App HTML should not use inline onerror handlers');
for (const workerSource of [serviceWorker, publicServiceWorker]) {
  assert(workerSource.includes("url.hostname === 'supabase.co' || url.hostname.endsWith('.supabase.co')"), 'Service worker should only match real Supabase hostnames');
  assert(workerSource.includes("url.pathname.startsWith('/auth/')"), 'Service worker should bypass auth routes');
  assert(workerSource.includes("url.pathname.startsWith('/rest/')"), 'Service worker should bypass REST routes');
  assert(workerSource.includes("url.pathname.startsWith('/storage/')"), 'Service worker should bypass storage routes');
}

for (const hostingConfig of [netlify, vercel]) {
  assert(hostingConfig.includes('Content-Security-Policy'), 'Hosting config should define a CSP');
  assert(hostingConfig.includes("frame-ancestors 'none'"), 'CSP should block framing');
  assert(hostingConfig.includes("object-src 'none'"), 'CSP should block plugin objects');
  assert(hostingConfig.includes('X-Content-Type-Options'), 'Hosting config should set nosniff header');
  assert(hostingConfig.includes('Referrer-Policy'), 'Hosting config should set referrer policy');
  assert(hostingConfig.includes('Permissions-Policy'), 'Hosting config should set permissions policy');
}

assert(!/service_role\s*[:=]/i.test(publicConfig), 'Public app config must not expose a service role key');
assert(schema.includes("values ('xpressintra-media', 'xpressintra-media', false"), 'Media storage bucket should be private');
assert(schema.includes("allowed_mime_types = excluded.allowed_mime_types"), 'Media bucket should keep MIME allow-list');
assert(schema.includes("split_part(name, '/', 1) = auth.uid()::text"), 'Storage uploads should be scoped to the user folder');
assert(securityDoc.includes('Lost phone process'), 'Security checklist should include lost phone handling');
assert(app.includes('function securityReadinessItems()'), 'App should include the operational security checklist');
assert(app.includes('openSecurityCenterModal'), 'App should expose a security center modal');
assert(app.includes("data-action=\"open-security-center\""), 'Creator/admin UI should link to the security center');

console.log('Security hardening smoke test passed');


