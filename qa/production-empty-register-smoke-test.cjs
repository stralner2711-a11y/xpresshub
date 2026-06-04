const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('src/app.js', 'utf8');

function createHarness(url = 'https://stralner2711-a11y.github.io/xpresshub/') {
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const storage = new Map();
  const document = {
    createElement() { return { className: '', innerHTML: '', classList: { add() {}, remove() {} }, append() {}, remove() {}, addEventListener() {} }; },
    head: { append() {} },
    body: { append() {}, insertAdjacentHTML() {} },
    querySelector(selector) {
      if (selector === '#app') return appElement;
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
      location: { href: url },
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
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });
  return { context, appElement };
}

const { context, appElement } = createHarness();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(vm.runInContext('DEMO_MODE', context) === false, 'Fresh production app should not enable demo mode');
assert(vm.runInContext('supabaseConfig().url', context) === 'https://mtfbdoajzmlgqbeiubxe.supabase.co', 'Production app should include the bundled Supabase URL fallback');
assert(vm.runInContext('supabaseConfig().anonKey', context).startsWith('sb_publishable_'), 'Production app should include the bundled Supabase publishable key fallback');
assert(vm.runInContext('employees.length', context) === 0, 'Fresh production app should start with an empty employee register');
assert(vm.runInContext('vehicles.length', context) === 0, 'Fresh production app should start without demo vehicles');
assert(vm.runInContext('announcements.length', context) === 0, 'Fresh production app should start without demo posts');
assert(!appElement.innerHTML.includes('demo@xpressintra.local'), 'Production login should not prefill demo email');
assert(!appElement.innerHTML.includes('Opret konto med standardkode'), 'Public production login should not expose standard-password onboarding');
assert(appElement.innerHTML.includes('Standardkode-oprettelse vises kun via link'), 'Public production login should explain invite-only signup');

const invited = createHarness('https://stralner2711-a11y.github.io/xpresshub/?invite=test-123&email=ny@example.com');
assert(invited.appElement.innerHTML.includes('Opret konto med standardkode'), 'Invite link should expose standard-password onboarding');
assert(invited.appElement.innerHTML.includes('ny@example.com'), 'Invite link should prefill the invited email');
assert(invited.appElement.innerHTML.includes('readonly'), 'Invite email should be locked on the signup screen');

console.log('Production empty register smoke test passed');


