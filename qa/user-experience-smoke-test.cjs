const fs = require('fs');
const vm = require('vm');
const appSourceText = fs.readFileSync('src/app.js', 'utf8');

if (appSourceText.includes('class="modal-close" data-action="close-modal">${icon(\'close\')}</button>')) {
  throw new Error('Modal close buttons should have an accessible label');
}
if (!appSourceText.includes('class="modal-close" data-action="close-modal" aria-label="Luk"')) {
  throw new Error('Modal close buttons should be labelled in Danish');
}

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'demo' })]]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
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
  return { appElement, modalNodes, run: script => vm.runInContext(script, context) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const harness = createHarness();

harness.run(`
employees = [
  { id: 'driver-1', name: 'Test Chauffør', initials: 'TC', role: 'Lastbilchauffør', accessRole: 'employee', vehicleType: 'truck', truck: 'Testbil', employmentStatus: 'active' },
  { id: 'office-1', name: 'Kontor Test', initials: 'KT', role: 'Kontor', accessRole: 'dispatcher', vehicleType: 'dispatch', truck: 'Kontor', employmentStatus: 'active' },
];
chats = [
  { id: 'trucks', name: 'Lastbilchat', initials: 'LB', preview: 'Test Chauffør: klar', time: '10:15', unread: 0, channel: 'truck' },
];
messages = {
  trucks: [
    { side: 'them', body: 'Klar til test', time: '10:15', senderId: 'driver-1', senderName: 'Test Chauffør', senderInitials: 'TC', senderRole: 'Lastbilchauffør' },
  ],
};
`);

harness.run("activeTab = 'home'; render();");
assert(!harness.appElement.innerHTML.includes('Dagens assistent'), 'Home should not show the removed daily assistant');
assert(!harness.appElement.innerHTML.includes('Næste handling'), 'Home should not show the removed assistant action');
assert(harness.appElement.innerHTML.includes('home-driver-tools'), 'Home should show a simple primary driver tool area');
assert(!harness.appElement.innerHTML.includes('Mere på forsiden'), 'Home should not hide old duplicate sections behind a more drawer');

harness.run("activeTab = 'chat'; activeChat = null; render();");
assert(harness.appElement.innerHTML.includes('Søg i beskeder'), 'Chat should expose message search');
assert(harness.appElement.innerHTML.includes('Vigtig besked'), 'Chat should highlight important messages');
assert(!harness.appElement.innerHTML.includes('announcement-section'), 'Chat should keep news posts out of messages');

harness.run("activeTab = 'chat'; activeChat = 'trucks'; render();");
assert(harness.appElement.innerHTML.includes('message-row'), 'Conversation should render structured message rows');
assert(harness.appElement.innerHTML.includes('Test Chauffør'), 'Messages should show sender profile names');
assert(harness.appElement.innerHTML.includes('Lastbilchat'), 'Conversation header should show channel name');

harness.run("activeTab = 'map'; render();");
assert(harness.appElement.innerHTML.includes('Arbejdsstatus'), 'Map should show work status chips');
assert(harness.appElement.innerHTML.includes('Kan hjælpe'), 'Map should support can-help status');

harness.run('openLogbookModal();');
const logbook = harness.modalNodes.find(node => node.innerHTML.includes('Personlig logbog'));
assert(logbook.innerHTML.includes('Dagens opsamling'), 'Logbook should show a daily summary');
assert(logbook.innerHTML.includes('Gem dagen som minde'), 'Logbook should offer to save the day');

const styles = fs.readFileSync('src/styles.css', 'utf8');
assert(styles.includes('font-size: 12px'), 'Styles should lift small mobile text');
assert(styles.includes('.bottom-nav { position: absolute; z-index: 12;'), 'Bottom navigation should sit above page content so mobile taps are not intercepted');
assert(styles.includes('padding: 18px 0 calc(84px + env(safe-area-inset-bottom))'), 'Modal sheets should leave room for the mobile bottom navigation');
assert(styles.includes('max-height: calc(100vh - 122px - env(safe-area-inset-bottom))'), 'Modal sheets should remain scrollable above the mobile bottom navigation');
assert(!styles.includes('.daily-assistant'), 'Styles should not keep removed daily assistant layout');

console.log('User experience smoke test passed');


