const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('src/app.js', 'utf8');
const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
const storage = new Map();

const document = {
  createElement() { return { className: '', innerHTML: '', classList: { add() {}, remove() {} }, append() {}, remove() {}, addEventListener() {} }; },
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(vm.runInContext('DEMO_MODE', context) === false, 'Fresh production app should not enable demo mode');
assert(vm.runInContext('employees.length', context) === 0, 'Fresh production app should start with an empty employee register');
assert(vm.runInContext('vehicles.length', context) === 0, 'Fresh production app should start without demo vehicles');
assert(vm.runInContext('announcements.length', context) === 0, 'Fresh production app should start without demo posts');
assert(!appElement.innerHTML.includes('demo@xpressintra.local'), 'Production login should not prefill demo email');
assert(appElement.innerHTML.includes('Supabase skal sættes op før login'), 'Production login should require Supabase setup');

console.log('Production empty register smoke test passed');
