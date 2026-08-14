const fs = require('fs');
const vm = require('vm');

function createHarness(session = true) {
  const code = fs.readFileSync('app.js', 'utf8');
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
const source = fs.readFileSync('app.js', 'utf8');

assert(source.includes('navigator.geolocation.getCurrentPosition(updateLocation'), 'Location sharing should request a first GPS position before waiting for live updates');
assert(source.includes("if (activeTab === 'map') initializeMaps();"), 'GPS updates on the map should refresh markers without rebuilding the full screen');
assert(source.includes('large && people.length && isNewMap'), 'Leaflet should only auto-fit a newly created map');
assert(!source.includes("if (activeTab === 'map') render({ preserveScroll: true });"), 'GPS updates should not repeatedly re-render the map screen');
assert(source.includes('function disposeLeafletMaps()'), 'Detached Leaflet maps should have an explicit disposal path');
assert(source.includes('delete leafletInstances[id]'), 'Disposed Leaflet maps should release retained container references');
assert(/function render\(options = \{\}\)[\s\S]*?disposeLeafletMaps\(\);[\s\S]*?document\.querySelector\('#app'\)\.innerHTML/.test(source), 'Render should dispose maps before replacing the app DOM');
assert(source.includes('function mapVehicleGlyph'), 'Live map should use role-specific vehicle icons');
assert(source.includes('viewBox="0 0 46 24"'), 'Truck marker should include a tractor and semi-trailer icon');
assert(source.includes("mapLegendIcon('dispatch')"), 'Live map legend should include the office marker for dispatchers and management');
assert(source.includes("markerType === 'truck' ? [40, 30] : [32, 30]"), 'Map markers should stay compact enough for a phone map');
assert(source.includes("officeRole.includes('disponent')") && source.includes("officeRole.includes('chef')"), 'Dispatchers and managers should use the office marker');
assert(harness.run("mapMarkerType({ vehicleType: 'truck', role: 'Chef', accessRole: 'admin' })") === 'dispatch', 'A manager should use the office marker even if an old vehicle value remains');
assert(harness.run("mapMarkerType({ vehicleType: 'truck', role: 'Lastbilchauffør', accessRole: 'employee' })") === 'truck', 'A truck driver should use the tractor and semi-trailer marker');
assert(harness.run("mapMarkerType({ vehicleType: 'van', role: 'Varebilschauffør', accessRole: 'employee' })") === 'van', 'A van driver should use the van marker');

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
assert(harness.appElement.innerHTML.includes('legend-vehicle truck'), 'Live map legend should show the truck icon');
assert(harness.appElement.innerHTML.includes('legend-vehicle van'), 'Live map legend should show the van icon');
assert(harness.appElement.innerHTML.includes('legend-vehicle dispatch'), 'Live map legend should show the office icon');

harness.run(`{
  const ownId = session?.userId || currentEmployee().id;
  employees = employees.map(person => person.id === ownId
    ? { ...person, sharing: true, coords: [56.1, 10.0] }
    : person);
  location = { ...location, sharing: false, coords: null };
}`);
assert(harness.run('visibleMapPeople().some(person => String(person.id) === String(session?.userId || currentEmployee().id))') === false, 'A stale server copy must not show your own marker while local sharing is off');

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

harness.run("navigator.geolocation = { clearWatch(id) { globalThis.clearedLocationWatch = id; } }; location = { ...location, sharing: true, watchId: 42, timer: 2, coords: [56.1, 10.0] }; resetLocationSyncGuard(); handleLocationSyncError({ status: 401, message: 'JWT expired' });");
assert(harness.run('location.sharing') === false, 'An expired Supabase session should stop GPS sharing');
assert(harness.run('globalThis.clearedLocationWatch') === 42, 'An expired Supabase session should clear the active GPS watch');
assert(harness.run('locationAuthFailureHandled') === true, 'An expired Supabase session should only be handled once');
assert(harness.run("document.querySelector('.toast').textContent.includes('session er udløbet')") === true, 'An expired session should explain why GPS sharing stopped');

harness.run("location = { ...location, sharing: true, coords: [56.1, 10.0] }; resetLocationSyncGuard(); handleLocationSyncError({ status: 503, message: 'Network unavailable' });");
assert(harness.run('location.sharing') === true, 'A temporary network error should keep local GPS sharing active');
assert(harness.run('locationSyncBackoffUntil > Date.now()') === true, 'A temporary network error should pause online retries briefly');
assert(harness.run('locationSyncWarningShown') === true, 'A temporary network error should only show one warning until syncing succeeds');

console.log('Live map smoke test passed');



