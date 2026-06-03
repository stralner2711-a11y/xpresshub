const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local' })]]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };

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
  return { appElement, run: script => vm.runInContext(script, context) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const harness = createHarness();

harness.run("globalQuery = 'Hamburg'; render();");
assert(harness.appElement.innerHTML.includes('global-search'), 'App shell should show global search');
assert(harness.appElement.innerHTML.includes('Drift og planlægning') || harness.appElement.innerHTML.includes('Hamburg'), 'Global search should find chat or route content');

harness.run("globalQuery = 'CMR'; render();");
assert(harness.appElement.innerHTML.includes('Information') || harness.appElement.innerHTML.includes('Kontoropslag'), 'Global search should find info and office content');

harness.run("globalQuery = 'TR 42'; render();");
assert(harness.appElement.innerHTML.includes('Køretøj') || harness.appElement.innerHTML.includes('Kollega'), 'Global search should find vehicles or employees');

console.log('Global search smoke test passed');
