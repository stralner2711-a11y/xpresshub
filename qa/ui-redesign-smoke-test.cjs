const fs = require('fs');
const vm = require('vm');

function createHarness(session = true) {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map(session ? [['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'demo' })]] : []);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const toast = { textContent: '', classList: { add() {}, remove() {} } };

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
      if (selector === '.toast') return toast;
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

const styles = fs.readFileSync('src/styles.css', 'utf8');
const harness = createHarness();

harness.run("activeTab = 'home'; render();");
assert(harness.appElement.innerHTML.includes('screen-guide'), 'Every main screen should show a simple guide');
assert(harness.appElement.innerHTML.includes('Start her'), 'Home guide should explain the screen');
assert(harness.appElement.innerHTML.includes('home-clean-hero'), 'Home should have a clean status hero');
assert(harness.appElement.innerHTML.includes('Arbejde'), 'Bottom navigation should include the new work screen');
assert(harness.appElement.innerHTML.includes('Kontor og fællesskab'), 'Home should group office and community content compactly');
assert(!harness.appElement.innerHTML.includes('Opgaver og kladder'), 'Home should not duplicate tasks and drafts from Work');
assert(harness.appElement.innerHTML.includes('Åbn chat'), 'Home should still offer quick access to social content');

harness.run("activeTab = 'more'; render();");
assert(harness.appElement.innerHTML.includes('Styr appen professionelt'), 'Creator control guide should explain professional app management');
assert(harness.appElement.innerHTML.includes('Kontrolcenter'), 'More should be renamed to Kontrolcenter');
assert(harness.appElement.innerHTML.includes('Daglig brug'), 'Control center should group daily tools');
assert(harness.appElement.innerHTML.includes('Sikkerhed og privatliv'), 'Control center should group security tools');
assert(harness.appElement.innerHTML.includes('Administration'), 'Control center should group admin tools');
assert(harness.appElement.innerHTML.includes('control-detail-group'), 'Control center should tuck longer groups into collapsible sections');

harness.run("activeTab = 'work'; render();");
assert(harness.appElement.innerHTML.includes('Arbejde og tur'), 'Work guide should explain workday controls');
assert(harness.appElement.innerHTML.includes('work-primary-grid'), 'Work screen should have primary work actions');
assert(harness.appElement.innerHTML.includes('Gem logbog'), 'Work screen should include logbook saving');

harness.run("activeTab = 'chat'; activeChat = null; render();");
assert(harness.appElement.innerHTML.includes('Beskeder samlet'), 'Chat guide should explain messages');
assert(harness.appElement.innerHTML.includes('chat-more-section'), 'Chat should tuck overview details behind a more section');
assert(!harness.appElement.innerHTML.includes('announcement-section'), 'Chat should not mix news posts into messages');
assert(harness.appElement.innerHTML.includes('Kanaler'), 'Chat should label internal channels');
assert(harness.appElement.innerHTML.includes('Direkte'), 'Chat should label direct messages');

harness.run("activeTab = 'chat'; activeChat = 'all'; render();");
assert(!harness.appElement.innerHTML.includes('screen-guide'), 'Open conversations should not waste space with the screen guide');

harness.run("activeTab = 'map'; render();");
assert(harness.appElement.innerHTML.includes('Livekort med frivillig GPS'), 'Map guide should explain voluntary sharing');
assert(harness.appElement.innerHTML.includes('map-hero-card'), 'Map should start with a simple GPS status card');
assert(harness.appElement.innerHTML.includes('Deling'), 'Map should label sharing controls');
assert(harness.appElement.innerHTML.includes('Rigtigt kort'), 'Map should explain the live map');
assert(harness.appElement.innerHTML.includes('Synlige kollegaer'), 'Map should label visible colleagues');

harness.run("activeTab = 'info'; render();");
assert(harness.appElement.innerHTML.includes('Hjælpecentral'), 'Info should feel like a dedicated help center');
assert(harness.appElement.innerHTML.includes('info-command-card'), 'Info should start with a clear command card');
assert(harness.appElement.innerHTML.includes('info-emergency-strip'), 'Info should put urgent phone actions first');
assert(harness.appElement.innerHTML.includes('info-choice-grid'), 'Info should use large choice cards');
assert(harness.appElement.innerHTML.includes('Akut og drift'), 'Info should make operations help obvious');
assert(harness.appElement.innerHTML.includes('Kontaktliste'), 'Info should include a practical contact list');
assert(harness.appElement.innerHTML.includes('open-contact-list'), 'Info should include a button to open the full contact list');
assert(harness.appElement.innerHTML.includes('tel:+4540553131'), 'Info contact list should include direct call links');
assert(harness.appElement.innerHTML.includes('info-contact-preview'), 'Info should preview important contacts');
assert(harness.appElement.innerHTML.includes('info-search-panel'), 'Info should keep search in a dedicated panel');
assert(harness.appElement.innerHTML.includes('Vælg et kort eller søg efter noget'), 'Info should not show heavy content before users ask');
assert(!harness.appElement.innerHTML.includes('contact-quick-card'), 'Info should not duplicate contact cards on the main view');
assert(!harness.appElement.innerHTML.includes('info-tabs'), 'Info should avoid a crowded tab row on the main view');
assert(!harness.appElement.innerHTML.includes('info-alert'), 'Info should not show rule alerts before the user asks for rules');

assert(harness.appElement.innerHTML.includes('info-more-section'), 'Info should tuck heavier guides behind a more section');
assert(harness.appElement.innerHTML.includes('Hurtige svar'), 'Info should still keep fast answers behind the more section');
assert(styles.includes('.surface-card'), 'Styles should include shared surface cards');
assert(styles.includes('.screen-section'), 'Styles should include reusable screen sections');
assert(styles.includes('.screen-guide'), 'Styles should include app-wide screen guide');
assert(styles.includes('.creator-pro-list'), 'Styles should include professional completion plan');
assert(styles.includes('.control-detail-group'), 'Styles should include collapsible control groups');
assert(styles.includes('.contact-directory'), 'Styles should include the information contact directory');
assert(styles.includes('.info-command-card'), 'Styles should include the rebuilt information command card');
assert(styles.includes('.info-choice-grid'), 'Styles should include senior-friendly information choice cards');
assert(styles.includes('.info-topic-list'), 'Styles should include a calm topic list for information');
assert(styles.includes('--tap-size: 48px'), 'Tap targets should be enlarged for mobile use');
assert(styles.includes('--radius-md'), 'Styles should define shared radius tokens');
assert(styles.includes('--surface-gradient'), 'Styles should define shared surface tokens');

console.log('UI redesign smoke test passed');


