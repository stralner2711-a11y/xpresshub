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

harness.run(`
notifications = [
  { id: 'message-test', type: 'Direkte besked', title: 'Testbesked', body: 'Test', time: '10:00', level: 'message', unread: true },
  { id: 'office-test', type: 'Kontoropslag', title: 'Kontortest', body: 'Test', time: '10:01', level: 'office', unread: false },
];
`);

harness.run("activeTab = 'home'; render();");
assert(!harness.appElement.innerHTML.includes('Husk i dag'), 'Home should not show the full daily reminder panel');
assert(harness.appElement.innerHTML.includes('Ulæst'), 'Home should keep a simple unread notification shortcut');
assert(!harness.appElement.innerHTML.includes('Mere på forsiden'), 'Home should no longer keep duplicate secondary content');
assert(!harness.appElement.innerHTML.includes('Start arbejdsdagen, s? deling og p?mindelser f?lger dine valg.'), 'Home reminders should not duplicate check-in');

harness.run('openNotificationsModal();');
const notificationModal = harness.modalNodes.find(node => node.innerHTML.includes('Notifikationer'));
assert(notificationModal, 'Notification modal should open');
assert(notificationModal.innerHTML.includes('Prioritet'), 'Notification modal should show priority grouping');
assert(notificationModal.innerHTML.includes('Rolige standarder'), 'Notification modal should explain calm defaults');
assert(notificationModal.innerHTML.includes('Marker alt som læst'), 'Notification modal should expose mark-all-read action');

assert(harness.run('notificationSummary().unread') >= 1, 'Notification summary should count unread notifications');

harness.run("addNotification({ type: 'Direkte besked', title: 'Skjult chat', body: 'Skal filtreres', level: 'message' });");
const before = harness.run('notifications.length');
harness.run("notificationPrefs = { ...notificationPrefs, chat: false }; addNotification({ type: 'Direkte besked', title: 'Chat slået fra', body: 'Denne skal ikke ind', level: 'message' });");
assert(harness.run('notifications.length') === before, 'Disabled chat notifications should not be added');

harness.run("addNotification({ type: 'Drift', title: 'Vigtig hastebesked', body: 'Ring til drift', level: 'urgent' });");
assert(harness.run('notificationSummary().urgent') >= 1, 'Notification summary should count urgent notifications');

harness.run('markAllNotificationsRead();');
assert(harness.run('notifications.every(item => item.unread === false)') === true, 'Mark all read should clear unread flags');

console.log('Notification center smoke test passed');


