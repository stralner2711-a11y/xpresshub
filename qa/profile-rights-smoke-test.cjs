const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'demo' })]]);
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

harness.run("applyCreatorPerspective('truck');");
harness.run('openProfileModal();');
const employeeModal = harness.modalNodes.at(-1);
assert(employeeModal.innerHTML.includes('Kontakt') && employeeModal.innerHTML.includes('Arbejde') && employeeModal.innerHTML.includes('Rettigheder') && employeeModal.innerHTML.includes('Privat'), 'Profile modal should group fields into simple sections');
assert(employeeModal.innerHTML.includes('Titel, rettighed, afdeling, beviser og køretøj er låst'), 'Employees should see a locked-fields explanation');
assert(employeeModal.innerHTML.includes('name="role"') && employeeModal.innerHTML.includes('disabled'), 'Employee role/title field should be disabled');
assert(employeeModal.innerHTML.includes('name="department"') && employeeModal.innerHTML.includes('disabled'), 'Employee department field should be disabled');
assert(employeeModal.innerHTML.includes('name="truck"') && employeeModal.innerHTML.includes('disabled'), 'Employee vehicle/unit field should be disabled');

harness.run("profile = { ...profile, role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch', truck: 'Ledelse' }; openProfileModal(employees.find(employee => employee.id === 'ma'));");
const adminModal = harness.modalNodes.at(-1);
assert(adminModal.innerHTML.includes('Chef/admin kan ændre titel'), 'Admin should see editable admin-fields explanation');
assert(adminModal.innerHTML.includes('Titel / rolle'), 'Admin should see title/role control');
assert(!adminModal.innerHTML.match(/<select name="role"[^>]*disabled/), 'Admin role/title field should be editable');
assert(!adminModal.innerHTML.match(/<input name="department"[^>]*disabled/), 'Admin department field should be editable');
assert(!adminModal.innerHTML.match(/<input name="truck"[^>]*disabled/), 'Admin vehicle/unit field should be editable');

console.log('Profile rights smoke test passed');


