const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

function createAppHarness() {
  const code = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  const storage = new Map([
    ['roadlog:session', JSON.stringify({ email: 'simulation@xpressintra.local', mode: 'demo' })],
  ]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const toast = { textContent: '', classList: { add() {}, remove() {} } };

  const document = {
    createElement() {
      return {
        className: '', innerHTML: '', dataset: {},
        classList: { add() {}, remove() {}, contains() { return false; } },
        append() {}, remove() {}, addEventListener() {}, setAttribute() {}, querySelector() { return null; }, closest() { return null; },
      };
    },
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
      XPRESSINTRA_DEMO_MODE: true,
      location: { href: 'https://simulation.xpressintra.local/', origin: 'https://simulation.xpressintra.local' },
      addEventListener() {}, scrollTo() {}, focus() {},
      matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} }; },
    },
    navigator: {
      onLine: true,
      geolocation: null,
      serviceWorker: { register() { return Promise.resolve(); }, ready: Promise.resolve(null) },
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
    URL,
  };
  context.window.document = document;
  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });
  return { run: script => vm.runInContext(script, context) };
}

function makeEmployees(count = 25) {
  return Array.from({ length: count }, (_, index) => {
    const vehicleType = index < 12 ? 'truck' : index < 22 ? 'van' : 'dispatch';
    return {
      id: `sim-user-${index}`,
      email: `sim-user-${index}@xpressintra.local`,
      name: `Simuleret Medarbejder ${index + 1}`,
      initials: `S${index + 1}`,
      role: vehicleType === 'truck' ? 'Lastbilchauffør' : vehicleType === 'van' ? 'Varebilschauffør' : 'Disponent',
      accessRole: index === 24 ? 'admin' : 'employee',
      vehicleType,
      truck: vehicleType === 'truck' ? `LB ${index + 1}` : vehicleType === 'van' ? `VB ${index + 1}` : 'Kontor',
      employmentStatus: 'active',
      sharing: false,
      coords: null,
    };
  });
}

(async () => {
  const startedAt = Date.now();
  const root = path.resolve(__dirname, '..');
  const cacheBust = Date.now();
  const offlineQueue = await import(`${pathToFileURL(path.join(root, 'offline-queue.js')).href}?qa=${cacheBust}`);
  const chat = await import(`${pathToFileURL(path.join(root, 'src', 'modules', 'chat.js')).href}?qa=${cacheBust}`);
  const updateSystem = await import(`${pathToFileURL(path.join(root, 'src', 'modules', 'update-system.js')).href}?qa=${cacheBust}`);
  const schema = fs.readFileSync(path.join(root, 'supabase', 'schema.sql'), 'utf8');
  const version = JSON.parse(fs.readFileSync(path.join(root, 'public', 'version.json'), 'utf8'));
  const employees = makeEmployees();

  assert.strictEqual(employees.filter(user => chat.hasChannelAccess('truck', user)).length, 12, 'Only the 12 truck drivers should enter the truck channel');
  assert.strictEqual(employees.filter(user => chat.hasChannelAccess('van', user)).length, 10, 'Only the 10 van drivers should enter the van channel');

  const harness = createAppHarness();
  harness.run(`
    session = { userId: 'sim-user-0', email: 'sim-user-0@xpressintra.local', mode: 'supabase' };
    employees = ${JSON.stringify(employees)};
    profile = employees[0];
    chats = [{ id: 'sim-all', name: 'Fælleschat', community: true, unread: 0, preview: '', time: '' }];
    messages = { 'sim-all': [] };
    notifications = [];
    activeChat = null;
    activeTab = 'work';
  `);

  const duplicateMessage = {
    id: 'sim-message-duplicate',
    conversation_id: 'sim-all',
    sender_id: 'sim-user-1',
    body: 'Samme realtime-besked',
    created_at: '2026-08-14T08:00:00.000Z',
    media_attachments: [],
  };
  harness.run(`globalThis.simDuplicateMessage = ${JSON.stringify(duplicateMessage)}`);
  await harness.run('Promise.all(Array.from({ length: 32 }, () => handleSupabaseMessage(globalThis.simDuplicateMessage)))');
  assert.strictEqual(harness.run("messages['sim-all'].filter(item => item.id === 'sim-message-duplicate').length"), 1, 'Concurrent realtime delivery must not duplicate one message');

  const messageRows = Array.from({ length: 500 }, (_, index) => ({
    id: `sim-message-${index}`,
    conversation_id: 'sim-all',
    sender_id: `sim-user-${index % employees.length}`,
    body: `Simuleret besked ${index + 1}`,
    created_at: new Date(Date.parse('2026-08-14T08:01:00.000Z') + index * 1000).toISOString(),
    media_attachments: [],
  }));
  harness.run(`globalThis.simMessageRows = ${JSON.stringify(messageRows)}`);
  await harness.run('Promise.all(globalThis.simMessageRows.map(row => handleSupabaseMessage(row)))');
  assert.strictEqual(harness.run("new Set(messages['sim-all'].map(item => item.id)).size"), 501, 'A burst of 500 messages should retain every unique message exactly once');
  assert.strictEqual(harness.run("messages['sim-all'].find(item => item.id === 'sim-message-1').senderName"), employees[1].name, 'Burst messages should stay linked to the correct sender profile');

  const now = Date.now();
  const locationRows = employees.map((employee, index) => ({
    user_id: employee.id,
    latitude: 55.5 + index * 0.01,
    longitude: 9.4 + index * 0.01,
    speed_kmh: index,
    visibility: 'team',
    audience: 'all',
    show_speed: true,
    show_vehicle: true,
    show_status: true,
    status: 'driving',
    share_mode: '15 min',
    last_updated_at: new Date(index >= 19 && index <= 21 ? now - 16 * 60 * 1000 : now - 30 * 1000).toISOString(),
    expires_at: new Date(index >= 22 ? now - 1000 : now + 15 * 60 * 1000).toISOString(),
  }));
  harness.run(`
    globalThis.simLocationRows = ${JSON.stringify(locationRows)};
    employees = employees.map(employee => {
      const row = globalThis.simLocationRows.find(item => item.user_id === employee.id);
      const share = locationShareFromSupabase(row);
      return share ? { ...employee, ...share } : employee;
    });
    location = { ...location, sharing: false, coords: null };
    mapFilter = 'all';
  `);
  assert.strictEqual(harness.run('visibleMapPeople().length'), 18, 'The map should show 18 fresh colleagues while hiding self, three stale and three expired positions');
  assert.strictEqual(harness.run("visibleMapPeople().some(person => person.id === 'sim-user-0')"), false, 'A remote copy must not expose the current user while local sharing is off');
  harness.run("location = { ...location, sharing: true, coords: [55.5, 9.4], speed: 42 }; workdayPrivacy = { ...workdayPrivacy, audience: 'all' }");
  assert.strictEqual(harness.run("visibleMapPeople().filter(person => person.id === 'sim-user-0').length"), 1, 'Active local sharing should add exactly one own marker');

  let queuedTotal = 0;
  let syncedTotal = 0;
  const queueStart = Date.parse('2026-08-14T09:00:00.000Z');
  for (const employee of employees) {
    let queue = [];
    for (let index = 0; index < 16; index += 1) {
      const input = {
        id: `${employee.id}-offline-${index}`,
        type: 'Chatbesked',
        body: `Offline ${index}`,
        source: 'Beskeder',
        action: 'send-chat-message',
        payload: { conversationId: 'sim-all', body: `Offline ${index}` },
        userId: employee.id,
        idempotencyKey: `chat:sim-all:${employee.id}:${index}`,
      };
      const added = offlineQueue.enqueue(queue, input, queueStart + index);
      queue = added.queue;
      const duplicate = offlineQueue.enqueue(queue, input, queueStart + index + 1);
      assert.strictEqual(duplicate.duplicate, true, 'Repeated offline taps should be idempotent');
      queue = duplicate.queue;
    }
    assert.strictEqual(queue.length, 16, 'Each employee should retain all 16 offline actions');
    assert(offlineQueue.dueItems(queue, queueStart + 100).every(item => item.userId === employee.id), 'Offline actions must remain tied to their own user');
    const processing = offlineQueue.markProcessing(queue, queue[0].id, queueStart + 200);
    const afterRestart = offlineQueue.normalizeQueue(JSON.parse(JSON.stringify(processing)), queueStart + 201);
    assert.strictEqual(afterRestart.find(item => item.id === queue[0].id).status, 'retrying', 'A restart must recover an interrupted send for retry');
    queue = afterRestart;
    for (const item of [...queue]) {
      queue = offlineQueue.markRetry(queue, item.id, new Error('Network timeout'), queueStart + 1000);
      queue = offlineQueue.markRetry(queue, item.id, new Error('Network timeout'), queueStart + 7000);
      queue = offlineQueue.markSynced(queue, item.id, queueStart + 20000);
    }
    const summary = offlineQueue.queueSummary(queue, queueStart + 20000);
    queuedTotal += summary.total;
    syncedTotal += summary.synced;
  }
  assert.strictEqual(queuedTotal, 400, 'The simulation should process 400 offline actions');
  assert.strictEqual(syncedTotal, 400, 'All 400 offline actions should recover after the connection returns');

  const officialApk = `https://github.com/stralner2711-a11y/xpresshub/releases/download/v${version.activeVersion}/xpressintra.apk`;
  const updateOptions = {
    currentHref: 'https://xpresshub-seven.vercel.app/',
    currentOrigin: 'https://xpresshub-seven.vercel.app',
    officialRepo: 'https://github.com/stralner2711-a11y/xpresshub',
  };
  const normalizedUpdate = updateSystem.normalizeVersionInfo({ ...version, apkDownloadUrl: officialApk }, updateOptions);
  assert.strictEqual(updateSystem.shouldShowUpdate(normalizedUpdate, { appVersionCode: version.activeVersionCode }), false, 'The installed build must not update-loop when version codes match');
  assert.strictEqual(updateSystem.shouldShowUpdate({ ...normalizedUpdate, activeVersionCode: version.activeVersionCode + 1 }, { appVersionCode: version.activeVersionCode }), true, 'A newer build should be offered');
  assert.throws(() => updateSystem.normalizeVersionInfo({ ...version, apkDownloadUrl: 'https://example.com/fake.apk' }, updateOptions), /godkendt GitHub-kilde/, 'An untrusted APK host must be rejected');

  assert(schema.includes('private.can_read_conversation(conversation_id)'), 'The simulated chat load still depends on the database conversation-membership policy');
  assert(schema.includes("last_updated_at > now() - interval '15 minutes'"), 'The database must also reject stale GPS rows');

  const durationMs = Date.now() - startedAt;
  console.log(`Simulated workday passed: 25 users, 501 realtime messages, 400 offline actions, 25 GPS rows, ${durationMs} ms`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
