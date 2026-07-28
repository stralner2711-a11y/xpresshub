const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'diagnostics.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'styles.css'), 'utf8');

assert(index.includes('<script type="module" src="./diagnostics.js"></script>'), 'Diagnostics must load after the main app');
assert(source.includes("const DIAGNOSTIC_STORAGE_KEY = 'xpressintra:diagnostic-events'"), 'Diagnostics must use isolated persistent storage');
assert(source.includes("request_type: 'bug'"), 'Automatic diagnostics must reuse the secured support request flow');
assert(source.includes("client.from('support_requests').insert"), 'Automatic diagnostics must sync through support_requests');
assert(source.includes("source: 'Automatisk app-tjek'"), 'Failed app checks must be recorded');
assert(source.includes('data-xpress-diagnostic'), 'The app must expose a one-tap diagnostic action');
assert(source.includes('Problemer med login?'), 'Login screen must expose a safe connection check');
assert(source.includes('data-xpress-diagnostic-stat'), 'Creator operations must show recent error count');
assert(source.includes('data-xpress-diagnostic-pending'), 'Creator operations must show pending diagnostic sync');
assert(source.includes('support_requests'), 'Diagnostics must stay inside the existing RLS-protected support table');
assert(source.includes("'Testes automatisk efter login'"), 'Realtime diagnostics must not report a false failure before login');
assert(source.includes("session ? 'ok' : 'warning'"), 'Missing login must be explained as a warning rather than a system failure');
assert(!/sb_secret_[A-Za-z0-9_-]{12,}/.test(source), 'Diagnostics source must not contain a secret Supabase key');
assert(styles.includes('.xpress-diagnostic-modal'), 'Diagnostics modal must have dedicated responsive styling');
assert(styles.includes('.xpress-diagnostic-list article.warning'), 'Diagnostics must visually distinguish warnings');

const functionStart = source.indexOf('function redact(');
const functionEnd = source.indexOf('\n}\n\nfunction readJsonStorage', functionStart) + 2;
assert(functionStart >= 0 && functionEnd > functionStart, 'Redaction helper must be present');
const sandbox = {};
vm.runInNewContext(`${source.slice(0, functionEnd)}; this.redact = redact;`, sandbox);

const secretMessage = [
  'Mail user@example.com',
  'password=Hemmelig123',
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QifQ.fakesignaturewithmorethan16chars',
  'sb_publishable_this_must_not_survive',
  'latitude=56.123456 longitude=10.123456',
  'https://example.com/path?token=abc#secret',
].join(' ');
const redacted = sandbox.redact(secretMessage);

assert(!redacted.includes('user@example.com'), 'Email addresses must be removed');
assert(!redacted.includes('Hemmelig123'), 'Passwords must be removed');
assert(!redacted.includes('eyJhbGciOiJIUzI1NiJ9'), 'Bearer tokens must be removed');
assert(!redacted.includes('sb_publishable_this_must_not_survive'), 'Public keys must be removed from reports');
assert(!redacted.includes('56.123456') && !redacted.includes('10.123456'), 'Precise coordinates must be removed');
assert(!redacted.includes('token=abc'), 'URL query strings must be removed');
assert(redacted.includes('[mail skjult]'), 'Redaction should explain that email was hidden');

console.log('App diagnostics smoke test passed');
