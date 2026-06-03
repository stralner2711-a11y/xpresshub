const fs = require('fs');
const vm = require('vm');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'employee@example.com', mode: 'demo' })]]);
  const modalNodes = [];
  const document = {
    createElement() {
      return {
        className: '',
        innerHTML: '',
        classList: { add() {}, remove() {}, contains() { return false; } },
        append() {},
        remove() {},
        addEventListener() {},
        querySelector() { return null; },
        closest() { return null; },
      };
    },
    head: { append() {} },
    body: { append(node) { modalNodes.push(node); }, insertAdjacentHTML() {} },
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
    navigator: { geolocation: null, serviceWorker: { register() { return Promise.resolve(); } } },
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
  };
  context.window.document = document;
  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });
  return { modalNodes, run: script => vm.runInContext(script, context) };
}

const harness = createHarness();

harness.run("profile = { ...profile, name: 'Almindelig Chauffør', email: 'driver@example.com', accessRole: 'employee', role: 'Chauffør' }; openSettingsModal();");
const employeeSettings = harness.modalNodes.at(-1).innerHTML;

assert(!employeeSettings.includes('Supabase URL'), 'Employee settings should not show Supabase URL field');
assert(!employeeSettings.includes('Offentlig anon key'), 'Employee settings should not show public key field');
assert(!employeeSettings.includes('Test Supabase-forbindelse'), 'Employee settings should not show Supabase diagnostics');
assert(employeeSettings.includes('Når jeg møder ind') || employeeSettings.includes('NÃ¥r jeg mÃ¸der ind'), 'Employee settings should still show workday privacy controls');

harness.run("profile = { ...profile, name: 'Tommy Hansen', email: 'stralner2711@gmail.com', accessRole: 'owner', role: 'Appansvarlig · Lastbilchauffør' }; openSettingsModal();");
const creatorSettings = harness.modalNodes.at(-1).innerHTML;

assert(creatorSettings.includes('Supabase URL'), 'Creator settings should show Supabase URL field');
assert(creatorSettings.includes('Offentlig anon key'), 'Creator settings should show public key field');
assert(creatorSettings.includes('Test Supabase-forbindelse'), 'Creator settings should show Supabase diagnostics');
assert(fs.readFileSync('src/app.js', 'utf8').includes('if (isCreatorOwner()) {\n      if (nextConfig.url || nextConfig.anonKey)'), 'Only creator should be able to change stored Supabase config from settings');

console.log('Settings visibility smoke test passed');
