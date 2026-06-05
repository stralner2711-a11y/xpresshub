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
assert(loginBlock.includes('const canUseStandardSignup = Boolean(backend.ready && inviteContext.valid)'), 'Signup should depend on a valid invitation link');
assert(loginBlock.includes('data-action="signup-standard-password"'), 'Login should support standard-password employee signup');
assert(loginBlock.includes('Standardkode-oprettelse vises kun første gang via link'), 'Public login should explain that standard signup requires a first-time invite link');
assert(app.includes('openTemporaryPasswordModal'), 'First login should force a personal password modal');
assert(app.includes("showToast('Du er logget ind på XpressIntra')"), 'Online login toast should use XpressIntra wording');
assert(!app.includes("showToast('Du er logget ind med Supabase')"), 'Online login toast should not expose Supabase wording to employees');
assert(app.includes('openStandardSignupPasswordModal'), 'Standard-code signup should open a personal password step before Supabase signup');
assert(!app.includes("signUpSupabase(data.get('email'), TEMPORARY_EMPLOYEE_PASSWORD)"), 'App must not send xpress to Supabase Auth as a real password');
assert(app.includes('first_personal_password'), 'Supabase signup metadata should mark when the user already chose a personal password');
assert(app.includes('Standardkoden bruges kun til første oprettelse via invitationslink'), 'Login should show a friendly message when xpress is used after signup');
assert(app.includes('Opret konto kræver et invitationslink fra chef eller creator'), 'Forced signup action should be blocked without invite link');
assert(app.includes('Arbejdsmailen skal matche invitationslinket'), 'Signup email should be locked to the invite link');
assert(app.includes('mindst 8 tegn, små bogstaver, store bogstaver og tal'), 'Signup should explain the active Supabase password policy');

console.log('Login screen smoke test passed');


