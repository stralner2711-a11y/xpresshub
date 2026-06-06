const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'demo' })]]);
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
assert(modal.innerHTML.includes('Jura-opdateringsvagt'), 'GDPR package should include ongoing legal maintenance');
assert(modal.innerHTML.includes('Hver 3. måned'), 'Legal maintenance should include a quarterly review cadence');
assert(modal.innerHTML.includes('Ved ny funktion'), 'Legal maintenance should require review when features change');

context.openLegalModal();
const legalModal = modalNodes.at(-1);
assert(legalModal.innerHTML.includes('Sikkerhed, privatliv & brugsvilkår'), 'Legal modal should include terms in the title');
assert(legalModal.innerHTML.includes('Brugsvilkår kort fortalt'), 'Legal modal should explain the internal terms');
assert(legalModal.innerHTML.includes('Jura-opdateringsvagt'), 'Legal modal should show ongoing maintenance');
assert(legalModal.innerHTML.includes('kun til interne medarbejdere'), 'Terms should state that the app is internal only');
assert(legalModal.innerHTML.includes('Din adgangskode er personlig'), 'Terms should explain password responsibility');
assert(legalModal.innerHTML.includes('Jeg accepterer brugsvilkår og privatliv'), 'Legal acceptance should cover terms and privacy');

const terms = fs.readFileSync('docs/brugsvilkaar.html', 'utf8');
assert(terms.includes('XpressIntra brugsvilkår'), 'Terms document should exist');
assert(terms.includes('Login og sikkerhed'), 'Terms document should cover login and security');
assert(terms.includes('GPS og lokationsdeling'), 'Terms document should cover GPS terms');
assert(terms.includes('Privat logbog og private beskeder'), 'Terms document should cover private areas');
const maintenance = fs.readFileSync('docs/JURA_OPDATERINGSPLAN.md', 'utf8');
assert(maintenance.includes('Hver 3. måned'), 'Legal maintenance document should define quarterly review');
assert(maintenance.includes('Ved ny funktion'), 'Legal maintenance document should define feature-triggered review');
assert(maintenance.includes('Bump `GDPR_POLICY_VERSION`'), 'Legal maintenance document should explain policy version bumps');

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


