const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const loginStart = app.indexOf('function renderLogin()');
const loginEnd = app.indexOf('function renderHome()', loginStart);
assert(loginStart !== -1 && loginEnd !== -1, 'renderLogin block should exist');

const loginBlock = app.slice(loginStart, loginEnd);
assert(!loginBlock.includes('backend-status'), 'Normal login should not show backend/online status');
assert(!loginBlock.includes('data-action="test-supabase"'), 'Normal login should not show Test Supabase');
assert(!loginBlock.includes('data-action="open-settings"'), 'Normal login should not show setup/settings');
assert(!loginBlock.includes('hasInviteLink'), 'Signup should no longer depend on invite links');
assert(loginBlock.includes('data-action="signup-standard-password"'), 'Login should support standard-password employee signup');
assert(loginBlock.includes('Første kode er xpress'), 'Login should explain the temporary standard password plainly');
assert(app.includes('openTemporaryPasswordModal'), 'First login should force a personal password modal');

console.log('Login screen smoke test passed');


