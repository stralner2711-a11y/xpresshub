const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'supabase', userId: 'user-1' })]]);
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
      addEventListener() {},
      scrollTo() {},
      matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} }; },
      supabase: { createClient() { return {}; } },
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
  return { modalNodes, run: script => vm.runInContext(script, context), storage };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const harness = createHarness();
harness.storage.set('roadlog:supabaseConfig', JSON.stringify({ url: 'https://demo.supabase.co', anonKey: 'public-anon-key' }));
harness.run("profile = { ...profile, role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch' }; legalAcceptance = { date: '31.05.2026', version: '2026-05-31' }; openLaunchChecklistModal();");

const modal = harness.modalNodes.at(-1);
assert(modal.innerHTML.includes('Klar til drift'), 'Launch modal should open');
assert(modal.innerHTML.includes('Supabase schema er kørt'), 'Launch modal should include Supabase schema step');
assert(modal.innerHTML.includes('Sikkerhedspakke'), 'Launch modal should include security package step');
assert(modal.innerHTML.includes('Første chef/admin er oprettet'), 'Launch modal should include first admin step');
assert(modal.innerHTML.includes('Testet på telefon'), 'Launch modal should include mobile testing step');
assert(modal.innerHTML.includes('supabase/first-admin.sql'), 'Launch modal should point to first-admin SQL helper');
assert(harness.run('launchReadiness().items.length') === 8, 'Launch readiness should track eight core go-live items');

console.log('Launch readiness smoke test passed');
