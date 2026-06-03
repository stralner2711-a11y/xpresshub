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

harness.run("activeTab = 'home'; logbookDrafts = [{ id: 'draft-1', title: 'Gem pause eller stop', place: 'Flensburg', note: 'Privat kladde fra turen', kind: 'pause-stop', date: 'I dag', status: 'draft' }]; activePickup = { employeeId: 'ma', note: 'Hent nøgle ved porten', duration: '30', status: 'started', steps: [], startedAt: new Date().toISOString(), startedLocationSharing: false }; render();");

assert(harness.appElement.innerHTML.includes('home-clean-hero'), 'Home should show a clean hero overview');
assert(harness.appElement.innerHTML.includes('home-next-action'), 'Home should show one clear next action');
assert(!harness.appElement.innerHTML.includes('home-profile'), 'Home should not duplicate the profile initials button');
assert(harness.appElement.innerHTML.includes('Vigtigt fra kontoret'), 'Home should prioritize office posts');
assert(harness.appElement.innerHTML.includes('home-simple-actions'), 'Home should show a simple primary action area');
assert(harness.appElement.innerHTML.includes('Fællesskab'), 'Home should still show community preview');
assert(!harness.appElement.innerHTML.includes('Mine opgaver'), 'Home should not duplicate work/task details from the Work screen');
assert(!harness.appElement.innerHTML.includes('Logbogskladder'), 'Home should not surface private logbook drafts');
assert(harness.appElement.innerHTML.includes('Hent nøgle ved porten'), 'Home task card should show active pickup note');
assert(!harness.appElement.innerHTML.includes('Gem pause eller stop'), 'Home should not surface private logbook draft title');
assert(harness.appElement.innerHTML.indexOf('Vigtigt fra kontoret') < harness.appElement.innerHTML.indexOf('Fællesskab'), 'Office priority should appear before the community preview');

console.log('Home dashboard smoke test passed');
