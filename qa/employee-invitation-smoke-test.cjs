const fs = require('fs');
const vm = require('vm');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = fs.readFileSync('src/app.js', 'utf8');

assert(source.includes('function normalizeEmployeeEmail'), 'Employee invite flow should normalize typed email addresses');
assert(source.includes('function employeeFromProfileForm'), 'New employees should be built through one safe helper');
assert(source.includes('async function prepareEmployeeInvitation'), 'Invitation creation should be automatic and centralized');
assert(source.includes("invitationStatus: 'local'"), 'App should create a local invitation fallback');
assert(source.includes("employee.invitationStatus = 'online'"), 'App should mark Supabase invitations as online');
assert(source.includes('createSupabaseEmployeeInvitation(employee)'), 'App should create Supabase invitations when online');
assert(source.includes('Arbejdsmail<input name="email" type="email"'), 'Employee profile modal should include work email');
assert(source.includes("${isNew ? 'required' : ''}"), 'Work email should be required for new employee invitations');
assert(source.includes('Opret konto med standardkode'), 'Invite result should explain the standard-password flow');
assert(source.includes('employeeDownloadPageUrl'), 'Invite flow should include the official app download page');
assert(source.includes('function officialAppUrl'), 'Invite flow should generate links from the official app URL');
assert(source.includes("appUrl: 'https://xpresshub-seven.vercel.app/'"), 'Invite links should default to the working web app URL');
assert(source.includes('function inviteMessage'), 'Invite flow should generate one reusable invite message');
assert(source.includes('copy-last-invite-link'), 'Invite generator should let admins copy the invite link');
assert(source.includes('copy-last-invite-message'), 'Invite generator should let admins copy the full invite message');
assert(source.includes('resend-last-confirmation'), 'Invite generator should let admins resend email confirmation');
assert(source.includes('Gensend bekræftelsesmail'), 'Admin UI should expose resend confirmation wording');
assert(source.includes("type: 'signup'"), 'Resent confirmations should use Supabase signup confirmation type');
assert(source.includes('Åbn dit invitationslink her'), 'Shared invite message should include the private invitation link');
assert(source.includes('Invitationslink:'), 'Invite result should show the private invitation link before sending');
assert(source.includes("onboarding_method: 'standard_password'"), 'Supabase invitations should store the onboarding method');
assert(source.includes('password_reset_required: true'), 'New employees should be forced to change the temporary password');

const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'demo' })]]);
const document = {
  createElement() { return { classList: { add() {}, remove() {} }, addEventListener() {}, remove() {}, append() {}, querySelector() { return null; } }; },
  head: { append() {} },
  body: { append() {}, insertAdjacentHTML() {} },
  querySelector(selector) {
    if (selector === '#app') return { innerHTML: '', classList: { add() {}, remove() {} } };
    if (selector === '.toast') return { textContent: '', classList: { add() {}, remove() {} } };
    return null;
  },
  querySelectorAll() { return []; },
  addEventListener() {},
};

const context = {
  console,
  document,
  window: {
    addEventListener() {},
    scrollTo() {},
    matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} }; },
  },
  navigator: {
    geolocation: null,
    serviceWorker: { register() { return Promise.resolve(); } },
  },
  localStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); },
  },
  sessionStorage: {
    getItem() { return '1'; },
    setItem() {},
  },
  setTimeout() { return 1; },
  clearTimeout() {},
  setInterval() { return 2; },
  clearInterval() {},
  FormData: class {},
  FileReader: class {},
  URL,
};
context.window.document = document;
context.window.localStorage = context.localStorage;
context.window.sessionStorage = context.sessionStorage;

vm.createContext(context);
vm.runInContext(source, context, { filename: 'app.js' });

const employee = vm.runInContext(`
  employeeFromProfileForm(new Map([
    ['name', '  Test Chauffør  '],
    ['email', '  NY.KOLLEGA@XPRESSBUDET.DK  '],
    ['role', 'Lastbilchauffør'],
    ['accessRole', 'employee'],
    ['vehicleType', 'truck'],
    ['truck', 'TR 99 999'],
    ['phone', '+45 12 34 56 78'],
    ['department', 'Lastbil'],
    ['license', 'C/E'],
    ['emergencyContact', 'Kontoret'],
    ['languages', 'Dansk']
  ]))
`, context);

assert(employee.name === 'Test Chauffør', 'Employee name should be trimmed');
assert(employee.email === 'ny.kollega@xpressbudet.dk', 'Employee email should be lowercased and trimmed');
assert(employee.invitationEmail === employee.email, 'Invitation should be bound to the typed work email');
assert(employee.invitationId.startsWith('local-'), 'New employees should always receive a local invitation id');
assert(employee.status === 'Invitation klar', 'New employee should show invite-ready status');
assert(employee.onboardingMethod === 'standard_password', 'New employee should use standard password onboarding');
assert(employee.passwordResetRequired === true, 'New employee should be forced to change temporary password');

const link = vm.runInContext("inviteLink({ email: 'NY.KOLLEGA@XPRESSBUDET.DK', invitationId: 'abc-123' }, 'abc-123')", context);
assert(link.startsWith('https://xpresshub-seven.vercel.app/'), 'Invite link should open the working web app');
assert(link.includes('invite=abc-123'), 'Invite link should include invitation id');
assert(link.includes('email=ny.kollega%40xpressbudet.dk'), 'Invite link should include normalized email');

const message = vm.runInContext("inviteMessage({ name: 'Test Chauffør', email: 'ny@example.com', invitationId: 'abc-123' }, 'abc-123')", context);
assert(message.invitationUrl.startsWith('https://xpresshub-seven.vercel.app/'), 'Invite message should include the working app URL');
assert(message.body.includes('Åbn dit invitationslink her'), 'Invite message should explain where to click');
assert(message.body.includes('Downloadside ved behov'), 'Invite message should keep the download page as fallback only');

console.log('Employee invitation smoke test passed');
