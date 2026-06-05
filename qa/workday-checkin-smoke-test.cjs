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

(async () => {
  const harness = createHarness();

  harness.run("activeTab = 'work'; render();");
  assert(harness.appElement.innerHTML.includes('Mød ind'), 'Home should show check-in button before the workday starts');

  assert(harness.appElement.innerHTML.includes('Arbejde'), 'Work page should be available as its own screen');
  assert(harness.appElement.innerHTML.includes('Del tur'), 'Work page should include trip sharing');
  assert(harness.appElement.innerHTML.includes('Gem logbog'), 'Work page should include logbook saving');
  assert(!harness.appElement.innerHTML.includes('work-permission-card'), 'Work page should not expose detailed permissions outside settings');
  assert(harness.appElement.innerHTML.includes('Indstil hvad der deles'), 'Work page should link to settings for permissions');

  harness.run('openSettingsModal();');
  const settingsModal = harness.modalNodes.find(node => node.innerHTML.includes('Indstillinger'));
  assert(settingsModal.innerHTML.includes('Når jeg møder ind') || settingsModal.innerHTML.includes('Når jeg møder ind'), 'Settings should expose workday permissions');
  assert(settingsModal.innerHTML.includes('Hvem må se min position?'), 'Settings should expose location audience');
  assert(settingsModal.innerHTML.includes('Vis fart'), 'Settings should let users decide if speed is visible');

  harness.run("workdayPrivacy = { ...workdayPrivacy, gps: false }; save('workdayPrivacy', workdayPrivacy);");
  await harness.run('startWorkday();');
  assert(harness.run('location.sharing') === false, 'Starting workday should not share location when GPS permission is off');
  await harness.run('endWorkday();');
  harness.run("workdayPrivacy = { ...workdayPrivacy, gps: true, audience: 'all' }; save('workdayPrivacy', workdayPrivacy);");

  await harness.run('startWorkday();');
  const workday = JSON.parse(harness.storage.get('roadlog:workday'));
  assert(workday.active === true, 'Starting workday should persist active status');
  assert(workday.endLabel === '19.00', 'Workday should be scheduled to end at 19:00');
  assert(harness.run('location.sharing') === true, 'Starting workday should start location sharing when GPS is allowed');
  assert(harness.run('WORKDAY_TIMEZONE') === 'Europe/Copenhagen', 'Workday shutdown should use Danish time zone explicitly');
  assert(harness.run("workdayEndTime(new Date('2026-01-15T17:00:00.000Z')).toISOString()") === '2026-01-15T18:00:00.000Z', 'Winter shutdown should be 19:00 Danish time');
  assert(harness.run("workdayEndTime(new Date('2026-07-15T16:00:00.000Z')).toISOString()") === '2026-07-15T17:00:00.000Z', 'Summer shutdown should be 19:00 Danish time');

  harness.run("activeTab = 'home'; render();");
  assert(harness.appElement.innerHTML.includes('Arbejdsdag aktiv'), 'Home should show active workday status');
  assert(harness.appElement.innerHTML.includes('Aktiv'), 'Home should keep a compact active workday status');
  assert(!harness.appElement.innerHTML.includes('Slut dag'), 'Home should not duplicate workday controls after start');
  assert(!harness.appElement.innerHTML.includes('<b>Meld fri</b>'), 'Home should hide the large check-in button after start');

  await harness.run("workday = { ...workday, active: true, endsAt: '2026-05-31T18:59:00.000+02:00' }; location = { ...location, sharing: true, timer: 2 }; save('workday', workday); enforceWorkdayExpiry(new Date('2026-05-31T19:01:00.000+02:00'));");
  assert(harness.run('workday.active') === false, 'Workday should end automatically after 19:00');
  assert(harness.run('location.sharing') === false, 'Automatic end should stop location sharing');

  console.log('Workday check-in smoke test passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});


