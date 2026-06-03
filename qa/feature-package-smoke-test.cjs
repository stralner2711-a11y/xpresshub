const fs = require('fs');
const vm = require('vm');

function createHarness(session = true) {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map(session ? [['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local' })]] : []);
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

harness.run("activeTab = 'more'; render();");
assert(harness.appElement.innerHTML.includes('Mine data'), 'More page should expose Mine data');
assert(harness.appElement.innerHTML.includes('Køretøjer'), 'More page should expose vehicle registry');
assert(harness.appElement.innerHTML.includes('Notifikationer'), 'More page should expose notifications');

harness.run('openMyDataModal();');
const myDataModal = harness.modalNodes.find(node => node.innerHTML.includes('Mine data'));
assert(myDataModal, 'Mine data modal should open');
assert(myDataModal.innerHTML.includes('Indsigt'), 'Mine data should include access request');
assert(myDataModal.innerHTML.includes('Eksport'), 'Mine data should include export request');

harness.run('openVehiclesModal();');
const vehiclesModal = harness.modalNodes.find(node => node.innerHTML.includes('Køretøjsregister'));
assert(vehiclesModal, 'Vehicle registry modal should open');
assert(vehiclesModal.innerHTML.includes('TR 42 918'), 'Vehicle registry should list truck TR 42 918');
assert(vehiclesModal.innerHTML.includes('VB 51 204'), 'Vehicle registry should list van VB 51 204');

harness.run("activeTab = 'home'; activePickup = { employeeId: 'ma', note: 'Test afhentning', duration: '30', status: 'started', steps: [], startedAt: new Date().toISOString(), startedLocationSharing: false }; save('activePickup', activePickup); render();");
assert(harness.appElement.innerHTML.includes('Startet'), 'Pickup card should show started status');
harness.run("updatePickupStatus('picked_up');");
assert(JSON.parse(harness.storage.get('roadlog:activePickup')).status === 'picked_up', 'Pickup status should be stored');

harness.run('openNotificationsModal();');
const notificationModal = harness.modalNodes.find(node => node.innerHTML.includes('Notifikationer'));
assert(notificationModal, 'Notification modal should open');
assert(notificationModal.innerHTML.includes('Direkte besked'), 'Notifications should include direct message');

console.log('Feature package smoke test passed');
