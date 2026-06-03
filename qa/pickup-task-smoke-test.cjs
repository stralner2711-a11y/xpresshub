const fs = require('fs');
const vm = require('vm');

function createHarness(session = true) {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map(session ? [['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'demo' })]] : []);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const toast = { textContent: '', classList: { add() {}, remove() {} } };
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
      if (selector === '.toast') return toast;
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
  return { appElement, modalNodes, storage, run: script => vm.runInContext(script, context) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const harness = createHarness();

harness.run('openPickupModal();');
const pickupModal = harness.modalNodes.find(node => node.innerHTML.includes('Hent for en kollega'));
assert(pickupModal, 'Pickup modal should open');
assert(pickupModal.innerHTML.includes('Afhentningssted'), 'Pickup modal should ask for pickup place');
assert(pickupModal.innerHTML.includes('Afleveringssted'), 'Pickup modal should ask for dropoff place');
assert(pickupModal.innerHTML.includes('Reference'), 'Pickup modal should ask for a reference');
assert(pickupModal.innerHTML.includes('Prioritet'), 'Pickup modal should ask for priority');
assert(pickupModal.innerHTML.includes('Tjekliste'), 'Pickup modal should explain checklist items');
assert(pickupModal.innerHTML.includes('Hurtig start'), 'Pickup modal should offer one-tap quick start');

harness.run(`activeTab = 'home';
activePickup = {
  employeeId: 'ma',
  note: 'Hent nøgle ved porten',
  pickupPlace: 'Kolding terminal',
  dropoffPlace: 'Hasselager kontor',
  reference: 'REF-42',
  priority: 'Haster',
  duration: '30',
  status: 'started',
  checklist: pickupChecklistItems().map(item => ({ ...item, done: item.id === 'route' })),
  steps: [{ status: 'started', at: new Date().toISOString() }],
  startedAt: new Date().toISOString(),
  startedLocationSharing: false
};
save('activePickup', activePickup);
render();`);

assert(harness.appElement.innerHTML.includes('Kolding terminal'), 'Pickup card should show pickup place');
assert(harness.appElement.innerHTML.includes('Hasselager kontor'), 'Pickup card should show dropoff place');
assert(harness.appElement.innerHTML.includes('REF-42'), 'Pickup card should show reference');
assert(harness.appElement.innerHTML.includes('Haster'), 'Pickup card should show priority');
assert(harness.appElement.innerHTML.includes('Tjekliste'), 'Pickup card should show checklist');
assert(harness.appElement.innerHTML.includes('Tidslinje'), 'Pickup card should show timeline');

harness.run("togglePickupChecklist('photo');");
assert(harness.run("activePickup.checklist.find(item => item.id === 'photo').done") === true, 'Checklist toggle should mark item done');

harness.run("updatePickupStatus('found');");
assert(JSON.parse(harness.storage.get('roadlog:activePickup')).steps.some(step => step.status === 'found'), 'Status update should append timeline step');

harness.run('finishPickup();');
assert(harness.run('pickupHistory.length') >= 1, 'Finished pickup should be saved to pickup history');

console.log('Pickup task smoke test passed');


