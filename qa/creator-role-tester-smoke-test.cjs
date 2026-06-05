const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'stralner2711@gmail.com', mode: 'demo' })]]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };

  const document = {
    createElement() { return { className: '', innerHTML: '', classList: { add() {}, remove() {} }, append() {}, remove() {}, addEventListener() {}, querySelector() { return null; }, closest() { return null; } }; },
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
  return { appElement, run: script => vm.runInContext(script, context) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const harness = createHarness();

harness.run("activeTab = 'more'; render();");
assert(harness.run("profile.accessRole") === 'owner', 'Demo creator should start with owner access');
assert(harness.appElement.innerHTML.includes('Creator test'), 'Demo creator should see role tester immediately');

harness.run("profile = { ...profile, email: 'almindelig@example.com', accessRole: 'employee' }; activeTab = 'more'; render();");
assert(!harness.appElement.innerHTML.includes('Creator test'), 'Normal employees should not see creator role tester');

harness.run("creatorRoleTester = { active: true, originalProfile: { email: 'stralner2711@gmail.com', accessRole: 'owner' }, currentRole: 'truck' }; profile = { ...profile, email: 'almindelig@example.com', accessRole: 'employee' }; sanitizeCreatorRoleTester(); activeTab = 'more'; render();");
assert(harness.run("creatorRoleTester.active") === false, 'Stale creator tester state should be cleared for another logged-in user');
assert(!harness.appElement.innerHTML.includes('Creator test'), 'Employees should not inherit creator tester from a previous session on the same device');

harness.run("profile = { ...profile, email: 'stralner2711@gmail.com', accessRole: 'owner', role: 'Appansvarlig · Lastbilchauffør', vehicleType: 'truck' }; activeTab = 'more'; render();");
assert(harness.appElement.innerHTML.includes('Creator test'), 'Creator should see role tester');
assert(harness.appElement.innerHTML.includes('Appansvarlig'), 'Role tester should include app responsible perspective');
assert(harness.appElement.innerHTML.includes('Lastbilchauffor'), 'Role tester should include truck perspective');
assert(harness.appElement.innerHTML.includes('Chef/admin'), 'Role tester should include admin perspective');

harness.run("profile = { ...profile, email: 'stralner2711@gmail.com', accessRole: 'owner', role: 'Appansvarlig · Lastbilchauffør', vehicleType: 'truck', department: 'Lastbil', license: 'C/E · EU kvalifikationsbevis' }; activeTab = 'chat'; activeChat = null; render();");
assert(harness.appElement.innerHTML.includes('Lastbilchat'), 'Creator with truck work function should see truck channel');

harness.run("applyCreatorPerspective('dispatcher'); activeTab = 'more'; render();");
assert(harness.run("profile.accessRole") === 'dispatcher', 'Switching to dispatcher should change access role locally');
assert(harness.run("isDispatcher()") === true, 'Dispatcher perspective should enable dispatcher UI');
assert(harness.appElement.innerHTML.includes('Driftsoverblik'), 'Dispatcher perspective should show dispatch overview');
assert(harness.appElement.innerHTML.includes('Creator test'), 'Creator tester should remain visible while viewing another role');

harness.run("applyCreatorPerspective('truck'); activeTab = 'chat'; render();");
assert(harness.run("profile.accessRole") === 'employee', 'Truck perspective should look like an employee');
assert(harness.appElement.innerHTML.includes('Lastbilchat'), 'Truck perspective should see truck channel');
assert(!harness.appElement.innerHTML.includes('Varebilchat'), 'Truck perspective should not see van channel');

harness.run("applyCreatorPerspective('creator'); activeTab = 'more'; render();");
assert(harness.run("profile.accessRole") === 'owner', 'Creator perspective should restore owner access');

console.log('Creator role tester smoke test passed');


