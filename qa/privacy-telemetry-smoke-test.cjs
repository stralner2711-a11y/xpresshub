const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const diagnostics = fs.readFileSync(path.join(root, 'diagnostics.js'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'supabase', 'schema.sql'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260814184500_privacy_preserving_app_metrics.sql'), 'utf8');
const privacy = fs.readFileSync(path.join(root, 'docs', 'privacy.html'), 'utf8');

for (const sql of [schema, migration]) {
  assert(sql.includes('create table if not exists public.app_telemetry_daily'), 'Aggregate telemetry table must exist');
  const tableStart = sql.indexOf('create table if not exists public.app_telemetry_daily');
  const tableEnd = sql.indexOf(');', tableStart);
  const table = sql.slice(tableStart, tableEnd);
  assert(!/user_id|email|message|latitude|longitude|route|file_name|device_id/i.test(table), 'Telemetry table must not contain personal or content columns');
  assert(sql.includes('alter table public.app_telemetry_daily enable row level security'), 'Telemetry table must use RLS');
  assert(sql.includes('admins can read aggregate app telemetry'), 'Only admins may read aggregate telemetry');
  assert(sql.includes('security definer'), 'Metric ingestion must use a guarded database function');
  assert(sql.includes('not private.is_active_employee()'), 'Only active authenticated employees may submit metrics');
  assert(sql.includes('revoke all on table public.app_telemetry_daily from public, anon, authenticated'), 'Direct metric writes must be revoked');
  assert(sql.includes('grant execute on function public.record_app_metric'), 'Authenticated users must only get the narrow metrics RPC');
  assert(sql.includes('metric_date < current_date - 90'), 'Old aggregate metrics must be automatically removed');
}

const rpcStart = diagnostics.indexOf("client.rpc('record_app_metric'");
const rpcEnd = diagnostics.indexOf('});', rpcStart) + 3;
const payload = diagnostics.slice(rpcStart, rpcEnd);
assert(rpcStart >= 0 && rpcEnd > rpcStart, 'Client metric RPC payload must exist');
for (const forbidden of ['user_id', 'email', 'message', 'latitude', 'longitude', 'route', 'file', 'device']) {
  assert(!payload.toLowerCase().includes(forbidden), `Metric payload must not contain ${forbidden}`);
}
for (const required of ['p_metric_date', 'p_event_key', 'p_result', 'p_detail_code', 'p_event_count', 'p_app_version', 'p_platform', 'p_duration_bucket']) {
  assert(payload.includes(required), `Metric payload must include ${required}`);
}

assert(diagnostics.includes("const ALLOWED_METRIC_KEYS = new Set(['app_start', 'runtime_error', 'health_check', 'long_task'])"), 'Metric event names must be allowlisted');
assert(!diagnostics.includes('p_raw_error'), 'Raw errors must never be uploaded');
assert(privacy.includes('Anonym teknisk statistik'), 'Privacy notice must describe automatic technical metrics');
assert(privacy.includes('Der gemmes ikke bruger-id, navn, mail, beskedtekst, GPS, billeder'), 'Privacy notice must list excluded personal data');

console.log('Privacy-preserving telemetry smoke test passed');
