const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'stralner2711@gmail.com', mode: 'demo' })]]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const modalNodes = [];

  function makeNode() {
    return {
      className: '',
      innerHTML: '',
      removed: false,
      classList: { add() {}, remove() {}, contains() { return false; } },
      append() {},
      remove() { this.removed = true; },
      addEventListener() {},
      querySelector() { return null; },
      closest() { return null; },
    };
  }

  const document = {
    createElement() { return makeNode(); },
    head: { append() {} },
    body: {
      append(node) { modalNodes.push(node); },
      insertAdjacentHTML() {},
    },
    querySelector(selector) {
      if (selector === '#app') return appElement;
      if (selector === '.toast') return { textContent: '', classList: { add() {}, remove() {} } };
      if (selector === '.modal-backdrop') return modalNodes.find(node => node.className === 'modal-backdrop' && !node.removed) || null;
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener() {},
  };

  const context = {
    console,
    document,
    window: {
      location: { href: 'https://xpresshub-seven.vercel.app/', origin: 'https://xpresshub-seven.vercel.app' },
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
    URL,
  };

  context.window.document = document;
  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });
  return { appElement, modalNodes, run: script => vm.runInContext(script, context) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(haystack, needle) {
  return (haystack.match(new RegExp(needle.replace(/[.*+^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

const harness = createHarness();

harness.run("activeTab = 'home'; activePickup = null; workday = { ...workday, active: false }; location = { ...location, sharing: false }; render();");
const home = harness.appElement.innerHTML;
assert(!home.includes('data-action="toggle-location"'), 'Home should not directly start/stop GPS; use Work or Live map');
assert(!home.includes('data-action="open-logbook"'), 'Home should not directly open logbook; use Work or Control');
assert(!home.includes('data-action="open-pickup"'), 'Home should not directly start pickup; use Work');
assert(home.includes('data-tab="work"') || home.includes('data-action="open-work"'), 'Home should still guide users to the Work hub');

harness.run("activeTab = 'work'; render();");
const work = harness.appElement.innerHTML;
assert(work.includes('data-action="toggle-location"'), 'Work should own GPS trip sharing');
assert(work.includes('data-action="open-logbook"'), 'Work should own quick logbook access');
assert(work.includes('data-action="open-pickup"'), 'Work should own pickup/help tasks');

harness.run("profile = { ...profile, name: 'Tommy Hansen', email: 'stralner2711@gmail.com', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner', vehicleType: 'truck' }; openAdminModal();");
const creatorAdmin = harness.modalNodes.at(-1).innerHTML;
assert(count(creatorAdmin, 'Medarbejdere ind i appen') === 1, 'Creator admin modal should show onboarding in one place only');
assert(!creatorAdmin.includes('admin-command-row'), 'Creator should use Creator drift shortcuts instead of duplicate admin shortcut row');

harness.run("profile = { ...profile, name: 'Chef Test', email: 'chef@example.com', role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch' }; openAdminModal();");
const adminModal = harness.modalNodes.at(-1).innerHTML;
assert(count(adminModal, 'Medarbejdere ind i appen') === 1, 'Admin modal should show onboarding in one place only');
assert(adminModal.includes('admin-command-row'), 'Normal admin should keep the admin shortcut row');

console.log('Function centralization smoke test passed');
