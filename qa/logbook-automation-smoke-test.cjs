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

harness.run('openLogbookModal();');
const logbookModal = harness.modalNodes.find(node => node.innerHTML.includes('Personlig logbog'));
assert(logbookModal, 'Logbook modal should open');
assert(logbookModal.innerHTML.includes('Automatiske forslag'), 'Logbook should show automated suggestions');
assert(logbookModal.innerHTML.includes('Mine steder'), 'Logbook should show personal place stats');
assert(logbookModal.innerHTML.includes('Automation'), 'Logbook should show automation controls');
assert(logbookModal.innerHTML.includes('Gem aktuel lokation'), 'Logbook should offer current location saving');
assert(logbookModal.innerHTML.includes('Smart logbog'), 'Logbook should show one simple smart logbook master switch');
assert(logbookModal.innerHTML.includes('Pauser og stop'), 'Logbook should show a simple stop/pause toggle');
assert(logbookModal.innerHTML.includes('Private kladder'), 'Logbook should show private drafts');
assert(logbookModal.innerHTML.includes('Brug min lokation'), 'Logbook place field should offer current location');

harness.run("location = { ...location, sharing: true, speed: 0, points: 2, coords: [54.7833, 9.4333] };");
assert(harness.run('currentLogbookPlace()') === 'Min lokation · Flensburg', 'Current location helper should prefer live location and known place');

harness.run("createAutoLogEntry('current-location');");
const entriesAfterAuto = harness.run('logEntries');
assert(entriesAfterAuto[0].source === 'auto', 'Automated entry should be marked as auto');
assert(entriesAfterAuto[0].kind === 'current-location', 'Automated entry should keep its source kind');
assert(JSON.parse(harness.storage.get('roadlog:logEntries'))[0].source === 'auto', 'Automated entry should be persisted');

harness.run("toggleLogbookAutomation('autoDrafts');");
const settings = JSON.parse(harness.storage.get('roadlog:logbookAutomation'));
assert(settings.autoDrafts === false, 'Automation toggle should be persisted');

harness.run("toggleLogbookAutomation('autoDrafts');");
harness.run("logbookDrafts = []; location = { ...location, sharing: true, speed: 0, points: 3 }; syncLogbookDrafts();");
const draftsAfterSync = harness.run('logbookDrafts');
assert(draftsAfterSync.some(draft => draft.kind === 'pause-stop'), 'Smart logging should create a private pause draft');
assert(JSON.parse(harness.storage.get('roadlog:logbookDrafts')).some(draft => draft.kind === 'pause-stop'), 'Private drafts should be persisted');

const draftId = draftsAfterSync[0].id;
harness.run(`approveLogbookDraft('${draftId}');`);
const entriesAfterApprove = harness.run('logEntries');
assert(entriesAfterApprove[0].status === 'approved', 'Approved draft should become a saved log entry');
assert(!harness.run('logbookDrafts').some(draft => draft.id === draftId), 'Approved draft should be removed from drafts');

harness.run("toggleLogbookAutomation('smartLogbook');");
const disabledSettings = JSON.parse(harness.storage.get('roadlog:logbookAutomation'));
assert(disabledSettings.smartLogbook === false, 'Smart logbook master switch should be persisted');

console.log('Logbook automation smoke test passed');


