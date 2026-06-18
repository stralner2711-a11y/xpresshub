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
profile = { ...profile, name: 'Tommy Skaber', email: 'stralner2711@gmail.com', role: 'Creator', accessRole: 'owner', vehicleType: 'truck' };
employees = [
  { id: 'th', name: 'Tommy Skaber', initials: 'TS', role: 'Creator', accessRole: 'owner', vehicleType: 'truck', employmentStatus: 'active', online: true },
  { id: 'ma', name: 'Test Chauffør', initials: 'TC', role: 'Chauffør', accessRole: 'employee', vehicleType: 'van', employmentStatus: 'active', online: true },
];
announcements = [
  { id: 'office-1', authorId: 'th', author: 'Kontoret', initials: 'XB', title: 'Læs dette', body: 'Vigtig besked', time: 'Nu', audience: 'Alle medarbejdere', kind: 'office', likes: 0, comments: [] },
];
`);

let postHtml = harness.run('renderFeedPost(announcements[0])');
assert(postHtml.includes('toggle-save-post'), 'Office posts should be saveable for later');
assert(postHtml.includes('mark-post-read'), 'Office posts should be markable as read');
assert(postHtml.includes('Ikke l'), 'Office posts should show read status before they are read');

harness.run("toggleSavedItem('announcement', 'office-1', 'Opslaget');");
assert(JSON.parse(harness.storage.get('roadlog:savedItems')).includes('announcement:office-1'), 'Saved post should persist locally');

harness.run("markAnnouncementRead('office-1');");
assert(Boolean(JSON.parse(harness.storage.get('roadlog:announcementReads'))['office-1']), 'Read state should persist locally');
postHtml = harness.run('renderFeedPost(announcements[0])');
assert(postHtml.includes('Læst'), 'Read posts should show read status');

harness.run("queueOfflineChange('Afhentning', 'Status gemt lokalt', 'Test', 'open-pickup');");
assert(harness.run('offlineQueueSummary().pending') === 1, 'Offline queue should count pending local changes');
harness.run('openOfflineQueueModal();');
const queueModal = harness.modalNodes.find(node => node.innerHTML.includes('Lokale ting der venter'));
assert(queueModal, 'Offline queue modal should open');
assert(queueModal.innerHTML.includes('Status gemt lokalt'), 'Offline queue should show pending item');

harness.run('openAdminModal();');
const creatorModal = harness.modalNodes.at(-1);
assert(creatorModal.innerHTML.includes('Venter lokalt'), 'Creator dashboard should show offline queue KPI');
assert(creatorModal.innerHTML.includes('Gemt til senere'), 'Creator dashboard should show saved item KPI');
assert(creatorModal.innerHTML.includes('Offline-k'), 'Creator dashboard should include offline queue health check');

const styles = fs.readFileSync('src/styles.css', 'utf8');
assert(styles.includes('.offline-queue-list'), 'Styles should include offline queue list');
assert(styles.includes('grid-template-columns: repeat(5,1fr)'), 'Home status strip should support saved/offline counters');

console.log('Professional operations package smoke test passed');

