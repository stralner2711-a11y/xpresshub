const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

assert.match(app, /let sessionLoadFailure = null/);
assert.match(app, /function renderSessionLoadFailure\(\)/);
assert.match(app, /Dit login er godkendt\./);
assert.match(app, /sessionLoadFailure && session[\s\S]*renderSessionLoadFailure\(\)/);
assert.match(app, /action === 'retry-session-data'[\s\S]*restoreSupabaseSession\(\)/);
assert.match(app, /return !DEMO_MODE && !sessionLoadFailure && !emergencyRecoveryActive/);

const restoreStart = app.indexOf('async function restoreSupabaseSession()');
const restoreEnd = app.indexOf('\nasync function signInSupabase', restoreStart);
const restoreSource = app.slice(restoreStart, restoreEnd);
const catchStart = restoreSource.indexOf('} catch (error) {');
const catchSource = restoreSource.slice(catchStart);
assert.match(catchSource, /sessionLoadFailure =/);
assert.doesNotMatch(catchSource, /session = null/);
assert.doesNotMatch(catchSource, /removeItem\('roadlog:session'\)/);

console.log('Session load failure smoke test passed');
