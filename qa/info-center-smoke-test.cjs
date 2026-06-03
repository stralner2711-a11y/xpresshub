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

harness.run("activeTab = 'info'; render();");

assert(harness.appElement.innerHTML.includes('20 sekunder'), 'Info center should show short 20-second answers');
assert(harness.appElement.innerHTML.includes('Favoritter'), 'Info center should expose favorites');
assert(harness.appElement.innerHTML.includes('Akut &amp; drift') || harness.appElement.innerHTML.includes('Akut & drift'), 'Info center should expose acute operations as a clear category');
assert(harness.appElement.innerHTML.includes('Regler'), 'Info center should expose rules as a clear category');
assert(harness.appElement.innerHTML.includes('Dokumenter'), 'Info center should expose documents as a clear category');
assert(harness.appElement.innerHTML.includes('Landeguider'), 'Info center should expose country guides');
assert(harness.appElement.innerHTML.includes('Checkliste'), 'Info center should expose checklists');
assert(harness.appElement.innerHTML.includes('Tyskland'), 'Info center should include Germany country guide');
assert(harness.appElement.innerHTML.includes('Lastbil'), 'Info center should keep truck targeting visible');
assert(harness.appElement.innerHTML.includes('Varebil'), 'Info center should keep van targeting visible');

harness.run("toggleInfoFavorite('trucks-køre-og-hviletid');");
const favorites = JSON.parse(harness.storage.get('roadlog:infoFavorites'));
assert(favorites.includes('trucks-køre-og-hviletid'), 'Info favorites should be persisted');

harness.run("activeInfoCategory = 'favorites'; render();");
assert(harness.appElement.innerHTML.includes('Køre- og hviletid'), 'Favorites tab should show saved info item');

console.log('Info center smoke test passed');


