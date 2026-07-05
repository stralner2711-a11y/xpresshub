const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const authModule = fs.readFileSync('src/modules/auth.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

assert(indexHtml.includes('src/modules/auth.js'), 'index.html should load the auth module');
assert(app.includes('XpressIntraAuth.loginInviteContext'), 'App should delegate invite context parsing to the auth module when loaded');
assert(app.includes('XpressIntraAuth.inviteLink'), 'App should delegate invite link building to the auth module when loaded');
assert(app.includes('XpressIntraAuth.inviteMessage'), 'App should delegate invite messages to the auth module when loaded');
assert(app.includes('XpressIntraAuth.personalPasswordError'), 'App should delegate password validation to the auth module when loaded');
assert(!app.includes('TEMPORARY_EMPLOYEE_PASSWORD'), 'App should not keep a shared onboarding password constant');

assert(authModule.includes('export function loginInviteContext'), 'Auth module should export invite context parsing');
assert(authModule.includes('export function inviteLink'), 'Auth module should export invite link builder');
assert(authModule.includes('export function inviteMessage'), 'Auth module should export invite message builder');
assert(authModule.includes('export function personalPasswordError'), 'Auth module should export password validation');
assert(authModule.includes('globalThis.XpressIntraAuth'), 'Auth module should expose a browser global for the app wrapper');
assert(authModule.includes('Vælg din egen personlige adgangskode'), 'Invite message should explain personal password setup');
assert(!authModule.includes('TEMPORARY_EMPLOYEE_PASSWORD'), 'Auth module should not contain a shared onboarding password constant');
assert(!authModule.includes('standardkoden'), 'Auth module should not mention a shared onboarding password');

console.log('Auth module smoke test passed');
