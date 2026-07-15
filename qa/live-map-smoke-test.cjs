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
      dataset: {},
      classList: { add() {}, remove() {}, contains() { return false; } },
      append() {},
      remove() { this.removed = true; },
      addEventListener() {},
      setAttribute(key, value) { this[key] = value; },
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
      XPRESSINTRA_DEMO_MODE: true,
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
const source = fs.readFileSync('src/app.js', 'utf8');

assert(source.includes('navigator.geolocation.getCurrentPosition(updateLocation'), 'Location sharing should request a first GPS position before waiting for live updates');
assert(source.includes("if (activeTab === 'map') initializeMaps();"), 'GPS updates on the map should refresh markers without rebuilding the full screen');
assert(source.includes('large && people.length && isNewMap'), 'Leaflet should only auto-fit a newly created map');
assert(!source.includes("if (activeTab === 'map') render({ preserveScroll: true });"), 'GPS updates should not repeatedly re-render the map screen');

harness.run("activeTab = 'map'; render();");

assert(harness.appElement.innerHTML.includes('Kortvarig deling'), 'Live map should explain that sharing here is temporary');
assert(harness.appElement.innerHTML.includes('Del i 15 min'), 'Live map should offer 15 minute sharing');
assert(harness.appElement.innerHTML.includes('Del i 30 min'), 'Live map should offer 30 minute sharing');
assert(harness.appElement.innerHTML.includes('Del i 60 min'), 'Live map should offer 60 minute sharing');
assert(!harness.appElement.innerHTML.includes('data-action="toggle-location"'), 'Hidden live map should not duplicate the persistent GPS trip sharing button');
assert(harness.appElement.innerHTML.includes('Sidst opdateret'), 'Live map should show last update text');
assert(harness.appElement.innerHTML.includes('Status'), 'Live map should show person status labels');
assert(harness.appElement.innerHTML.includes('Google Maps'), 'Live map should keep working Google Maps links');
assert(harness.appElement.innerHTML.includes('Deler nu'), 'Live map should offer a sharing-only filter');
assert(harness.appElement.innerHTML.includes('Kun kollegaer med aktiv deling vises'), 'Live map should explain visible markers');

harness.run('startTimedLocationSharing(30);');
assert(harness.run('location.sharing') === true, 'Timed sharing should start location sharing');
assert(Array.isArray(harness.run('location.coords')), 'Timed sharing should set usable coordinates for the map');
assert(harness.run('visibleMapPeople().some(person => person.id === (session?.userId || currentEmployee().id))') === true, 'Live map should include your own marker when sharing is active');
assert(harness.run('Boolean(location.expiresAt)') === true, 'Timed sharing should set an expiry time');
assert(harness.run('location.shareMode') === '30 min', 'Timed sharing should record the selected duration');

harness.run("activeTab = 'map'; render();");
assert(harness.appElement.innerHTML.includes('Stopper'), 'Active timed sharing should show when it stops');
assert((harness.appElement.innerHTML.match(/data-action="toggle-location"/g) || []).length === 1, 'Active live map should show one stop sharing button only');

harness.run("enforceLocationExpiry(new Date(new Date(location.expiresAt).getTime() + 1000));");
assert(harness.run('location.sharing') === false, 'Timed sharing should stop automatically after expiry');

console.log('Live map smoke test passed');



