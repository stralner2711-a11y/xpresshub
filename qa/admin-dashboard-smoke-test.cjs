const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local' })]]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const modalNodes = [];

  function makeNode() {
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const harness = createHarness();

harness.run("profile = { ...profile, role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch', truck: 'Ledelse' }; activePickup = { employeeId: 'ma', status: 'blocked', pickupPlace: 'Kolding', dropoffPlace: 'Hasselager', note: 'Hent CMR', checklist: [], steps: [] }; recordAdminAudit('Testhandling', 'Admin ændrede en kernefunktion'); openAdminModal();");
const modal = harness.modalNodes.at(-1);

assert(modal.innerHTML.includes('Chef-dashboard'), 'Admin modal should include the chef dashboard');
assert(modal.innerHTML.includes('Kontrol uden at læse privat chat'), 'Dashboard should explain the privacy boundary');
assert(modal.innerHTML.includes('aktive medarbejdere'), 'Dashboard should show employee KPI');
assert(modal.innerHTML.includes('aktive afhentninger'), 'Dashboard should show active pickup KPI');
assert(modal.innerHTML.includes('Afhentning: Kan ikke finde'), 'Dashboard should surface blocked pickup tasks');
assert(modal.innerHTML.includes('Seneste adminhandlinger'), 'Dashboard should show admin audit summary');
assert(modal.innerHTML.includes('Testhandling'), 'Dashboard should list recent admin audit entries');
assert(modal.innerHTML.includes('Registrér kollega') && modal.innerHTML.includes('Kontoropslag'), 'Dashboard should expose core admin actions');
assert(!modal.innerHTML.includes('Godmorgen Tommy. Din næste aflæsning'), 'Admin dashboard should not expose private/direct chat message content');

assert(!modal.innerHTML.includes('Appens drift'), 'Normal admin should not see creator-only operations panel');

harness.run("profile = { ...profile, name: 'Tommy Hansen', email: 'stralner2711@gmail.com', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner', vehicleType: 'truck' }; openAdminModal();");
const creatorModal = harness.modalNodes.at(-1);

assert(creatorModal.innerHTML.includes('Creator drift'), 'Creator should see the operations overview');
assert(creatorModal.innerHTML.includes('Appens drift'), 'Creator operations panel should be clearly named');
assert(creatorModal.innerHTML.includes('Test Supabase') && creatorModal.innerHTML.includes('Go-live tjek'), 'Creator should get important operations actions');
assert(creatorModal.innerHTML.includes('Sikkerhedscenter'), 'Creator should get the security center shortcut');
assert(creatorModal.innerHTML.includes('Dataanmodninger'), 'Creator should see privacy/data operations status');
assert(!creatorModal.innerHTML.includes('Godmorgen Tommy. Din nÃ¦ste aflÃ¦sning'), 'Creator operations panel should not expose private/direct chat message content');

assert(creatorModal.innerHTML.includes('Hvad skal du holde øje med?'), 'Creator should see prioritized action items');
assert(creatorModal.innerHTML.includes('Creator genveje'), 'Creator should see operations shortcuts');
assert(creatorModal.innerHTML.includes('Test appen som'), 'Creator should be able to switch role perspectives from operations');
assert(creatorModal.innerHTML.includes('Mangler og kvalitet'), 'Creator should see quality gaps');
assert(creatorModal.innerHTML.includes('Privatlivsvagt'), 'Creator should see the privacy guard');

harness.run("openSecurityCenterModal();");
const securityModal = harness.modalNodes.at(-1);
assert(securityModal.innerHTML.includes('Sikkerhedscenter'), 'Security center should open');
assert(securityModal.innerHTML.includes('Mistet telefon'), 'Security center should include lost phone handling');
assert(securityModal.innerHTML.includes('Supabase Security Advisor'), 'Security center should include Supabase Security Advisor');

console.log('Admin dashboard smoke test passed');
