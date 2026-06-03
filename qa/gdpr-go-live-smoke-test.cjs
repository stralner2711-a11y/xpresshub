const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local' })]]);
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
      document,
      addEventListener() {},
      scrollTo() {},
      setTimeout() { return 1; },
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
    sessionStorage: {
      getItem() { return null; },
      setItem() {},
    },
    setTimeout() { return 1; },
    clearTimeout() {},
    setInterval() { return 2; },
    clearInterval() {},
    FormData: class {},
    FileReader: class {},
  };

  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });
  return { context, modalNodes, run: script => vm.runInContext(script, context) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const { context, modalNodes, run } = createHarness();

context.openGdprGoLiveModal();
const modal = modalNodes.at(-1);
assert(modal.innerHTML.includes('GDPR go-live'), 'GDPR modal should open');
assert(modal.innerHTML.includes('Medarbejderinformation'), 'GDPR package should include employee notice');
assert(modal.innerHTML.includes('Dataområder og formål'), 'GDPR package should describe data areas');
assert(modal.innerHTML.includes('Slettefrister'), 'GDPR package should show retention periods');
assert(modal.innerHTML.includes('Dataanmodninger'), 'GDPR package should show data requests');
assert(modal.innerHTML.includes('Databehandleraftaler'), 'GDPR package should include supplier/DPA reminder');

run("profile = { ...profile, name: 'Tommy Hansen', email: 'stralner2711@gmail.com', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner' }; dataRequests = [{ id: 'request-1', label: 'Indsigt', message: 'Hvad gemmer appen?', status: 'open', createdAt: '02.06.2026' }];");
context.openGdprGoLiveModal();
const creatorModal = modalNodes.at(-1);
assert(creatorModal.innerHTML.includes('Marker behandlet'), 'Creator/admin should be able to handle data requests');
context.completeDataRequest('request-1');
assert(run("dataRequests[0].status") === 'completed', 'Completing a data request should update local status');

const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
assert(schema.includes('purge_expired_operational_data'), 'Supabase schema should include operational retention cleanup');
assert(schema.includes('auto_delete boolean not null default false'), 'Retention policies should track automatic cleanup');

console.log('GDPR go-live smoke test passed');
