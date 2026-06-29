const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const publicConfig = fs.readFileSync('public/app-config.js', 'utf8');
const serviceWorker = fs.readFileSync('public/service-worker.js', 'utf8');
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
const fullSetup = fs.readFileSync('supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql', 'utf8');

const loginStart = app.indexOf('function renderLogin()');
const loginEnd = app.indexOf('function renderHome()', loginStart);
assert(loginStart !== -1 && loginEnd !== -1, 'Login renderer should exist');
const loginBlock = app.slice(loginStart, loginEnd);

assert(!/service_role|sb_secret_|SUPABASE_SERVICE_ROLE/i.test(publicConfig), 'Public config must never expose secret Supabase keys');
assert(!/service_role|sb_secret_|SUPABASE_SERVICE_ROLE/i.test(app), 'Browser app must never contain secret Supabase keys');
assert(app.includes('signInWithPassword({ email, password })'), 'Login should use Supabase Auth password flow');
assert(app.includes('/auth/v1/token?grant_type=password'), 'REST fallback should use Supabase Auth endpoint, not a custom password table');
assert(!/localStorage\.setItem\([^)]*password/i.test(app), 'App must not persist passwords in localStorage');
assert(!/sessionStorage\.setItem\([^)]*password/i.test(app), 'App must not persist passwords in sessionStorage');
assert(!/roadlog:[^'"]*password/i.test(app), 'App must not define a password storage key');
assert(loginBlock.includes('type="password"'), 'Password field should use password input type');
assert(!loginBlock.includes('data-action="test-supabase"'), 'Employee login should not expose Supabase diagnostics');
assert(!loginBlock.includes('backend-status'), 'Employee login should not expose backend status banner');
assert(!loginBlock.includes('data-action="open-settings"'), 'Employee login should not expose setup/settings');
assert(loginBlock.includes('canUseStandardSignup'), 'Signup visibility should be controlled by online backend readiness');
assert(loginBlock.includes('data-action="signup-standard-password"'), 'Signup should use the standard-password onboarding flow');
assert(schema.includes("else 'paused'"), 'Database trigger should park open signups until admin approval');
assert(fullSetup.includes("else 'paused'"), 'Full SQL should park open signups until admin approval');

assert(serviceWorker.includes("url.pathname.startsWith('/auth/')"), 'Service worker must bypass auth routes');
assert(serviceWorker.includes("url.pathname.startsWith('/rest/')"), 'Service worker must bypass REST routes');
assert(serviceWorker.includes("url.pathname.startsWith('/storage/')"), 'Service worker must bypass storage routes');
assert(serviceWorker.includes("url.pathname.endsWith('/app-config.js')"), 'Service worker must not cache app-config.js');

assert(!/auth\.jwt\(\).*raw_user_meta_data/is.test(schema), 'RLS must not trust user-editable raw_user_meta_data claims');
assert(!/user_metadata/i.test(schema), 'RLS/schema should not authorize from user_metadata');
assert(schema.includes("or employment_status = 'active'") && schema.includes('or private.is_admin()'), 'Profile reads should expose pending users only to admins and the user themself');
assert(schema.includes("coalesce(invite.access_role, 'employee')"), 'New users should get access role from admin invitation, not self-claimed metadata');
assert(schema.includes("coalesce(invite.vehicle_type, 'van')"), 'New users should get vehicle type from admin invitation, not self-claimed metadata');
assert(schema.includes('on public.employee_invitations for all to authenticated using (private.is_admin())'), 'Only admins should manage employee invitations');
assert(fullSetup.includes('on public.employee_invitations for all to authenticated using (private.is_admin())'), 'Full setup should keep invitations admin-only');

console.log('Credential and privacy smoke test passed');
