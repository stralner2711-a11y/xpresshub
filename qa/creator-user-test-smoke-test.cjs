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

const harness = createHarness();

harness.run("profile = { ...profile, name: 'Tommy Hansen', email: 'stralner2711@gmail.com', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner', vehicleType: 'truck' }; openAdminModal();");
const creatorModal = harness.modalNodes.at(-1);
assert(creatorModal.innerHTML.includes('Kør brugertest'), 'Creator dashboard should expose a single user-test action');
assert(creatorModal.innerHTML.includes('Kør appen igennem som medarbejder'), 'Creator dashboard should show the user-test summary panel');
assert(creatorModal.innerHTML.includes('Employee ser ikke admin/creator'), 'User-test panel should include access-control verification');
assert(creatorModal.innerHTML.includes('Fælles og interne chats er adskilt'), 'User-test panel should include chat channel verification');
assert(creatorModal.innerHTML.includes('Telefon-test'), 'User-test panel should remind creator about real phone testing');
assert(!creatorModal.innerHTML.includes('Godmorgen Tommy. Din næste aflæsning'), 'User-test panel should not expose private/direct chat content');

harness.run('openCreatorUserTestModal();');
const reportModal = harness.modalNodes.at(-1);
assert(reportModal.innerHTML.includes('Creator QA'), 'Creator should be able to open the user-test report modal');
assert(reportModal.innerHTML.includes('Bestået'), 'Report should show passed checks');
assert(reportModal.innerHTML.includes('Bør tjekkes'), 'Report should show checks that require real-world validation');
assert(reportModal.innerHTML.includes('Privatlivsvagt'), 'Report should explain the privacy boundary');
assert(reportModal.innerHTML.includes('data-tab="home"'), 'Report tab checks should navigate with data-tab');
assert(reportModal.innerHTML.includes('data-action="open-admin"'), 'Report action checks should keep action buttons');

harness.run("profile = { ...profile, name: 'Almindelig Chauffør', email: 'driver@example.com', role: 'Chauffør', accessRole: 'employee', vehicleType: 'truck' }; activeTab = 'more'; render();");
assert(!harness.appElement.innerHTML.includes('Kør brugertest'), 'Employees should not see creator user-test controls');
assert(harness.run('renderCreatorUserTestPanel()') === '', 'Employee calls to render user-test panel should return nothing');

console.log('Creator user-test smoke test passed');
