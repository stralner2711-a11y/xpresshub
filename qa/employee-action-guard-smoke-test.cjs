const fs = require('fs');
const vm = require('vm');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const code = fs.readFileSync('src/app.js', 'utf8');
const storage = new Map([['roadlog:session', JSON.stringify({ email: 'employee@example.com', mode: 'demo' })]]);
const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
const modalNodes = [];
const listeners = {};

function makeNode(action) {
  return {
    className: '',
    innerHTML: '',
    classList: { add() {}, remove() {}, contains() { return false; } },
    append() {},
    remove() {},
    addEventListener() {},
    querySelector(selector) {
      if (selector === '.diagnostic-list') return { innerHTML: '' };
      return null;
    },
    closest(selector) {
      if (selector === '[data-action]' && action) return { dataset: { action }, closest: () => null };
      if (selector === '.modal-backdrop') return null;
      return null;
    },
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
  addEventListener(type, handler) { listeners[type] = handler; },
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

assert(typeof listeners.click === 'function', 'App should register a click handler');

vm.runInContext("profile = { ...profile, name: 'Almindelig Chauffør', email: 'driver@example.com', accessRole: 'employee', role: 'Chauffør', vehicleType: 'truck' };", context);

for (const action of ['test-supabase', 'new-employee', 'new-announcement', 'open-dispatch', 'open-security-center', 'open-launch-checklist', 'open-gdpr-go-live']) {
  listeners.click({ target: makeNode(action), preventDefault() {} });
  assert(modalNodes.length === 0, `Employee should not be able to open restricted action: ${action}`);
}

vm.runInContext("profile = { ...profile, name: 'Tommy Hansen', email: 'stralner2711@gmail.com', accessRole: 'owner', role: 'Appansvarlig · Lastbilchauffør', vehicleType: 'truck' };", context);
listeners.click({ target: makeNode('test-supabase'), preventDefault() {} });
assert(modalNodes.length === 1 && modalNodes[0].innerHTML.includes('Supabase'), 'Creator should still be able to open Supabase diagnostics');

console.log('Employee action guard smoke test passed');
