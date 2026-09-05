const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const source = fs.readFileSync('app.js', 'utf8');
function fn(name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'));
  assert(start >= 0, name);
  const rest = source.slice(start);
  return rest.slice(0, rest.indexOf('\n}\n') + 2);
}
// No network or real accounts. Exercise production handlers with isolated I/O.
(async () => {
  const results = [];
  for (const count of [100, 1000, 5000]) {
    let renders = 0;
    const callbacks = [];
    const context = vm.createContext({
      messages: {}, chats: [{ id: 'load' }], activeChat: 'load', activeTab: 'chat',
      session: { userId: 'self' }, supabaseMessageInFlight: new Set(),
      attachSignedMediaUrls: async rows => rows,
      messageFromSupabase: row => ({ ...row, side: 'me', time: '12:00' }),
      save: () => {}, render: () => renders++,
      chatRenderTimer: null, setTimeout: callback => { callbacks.push(callback); return callbacks.length; },
    });
    vm.runInContext(fn('scheduleChatRender'), context);
    vm.runInContext(fn('handleSupabaseMessage'), context);
    const rows = Array.from({ length: count }, (_, id) => ({ id, conversation_id: 'load', body: `Message ${id}` }));
    const started = performance.now();
    await Promise.all(rows.flatMap(row => [context.handleSupabaseMessage(row), context.handleSupabaseMessage(row)]));
    assert.equal(context.messages.load.length, count);
    assert.equal(new Set(context.messages.load.map(row => row.id)).size, count);
    assert.equal(context.supabaseMessageInFlight.size, 0);
    assert.equal(callbacks.length, 1, 'Burst must schedule only one screen update');
    callbacks[0]();
    assert.equal(renders, 1);
    results.push({ scenario: 'concurrent messages + duplicates', messages: count, renders, ms: Math.round(performance.now() - started) });
  }
  let creates = 0, fits = 0, removes = 0, updates = 0;
  const container = { id: 'test-map', dataset: { large: 'true' } };
  const map = { setView() {}, fitBounds() { fits++; }, invalidateSize() {}, remove() {} };
  const leaflet = {
    map: () => map, tileLayer: () => ({ addTo() {} }), divIcon: options => options,
    marker: () => { creates++; return { addTo() { return this; }, bindPopup() {}, setLatLng() { updates++; }, setIcon() {}, setPopupContent() {}, remove() { removes++; } }; },
  };
  const people = Array.from({ length: 1000 }, (_, id) => ({ id, name: `Test ${id}`, coords: [55 + id / 10000, 9], vehicleType: 'van' }));
  const context = vm.createContext({
    document: { querySelectorAll: () => [container] }, visibleMapPeople: () => people,
    ensureLeaflet: async () => leaflet, leafletInstances: {}, mapMarkerType: () => 'van',
    markerClass: () => 'van', mapMarkerHtml: () => '', text: x => x || '', vehicleLabel: x => x,
    setTimeout: () => {},
  });
  vm.runInContext(fn('initializeMaps'), context);
  const started = performance.now();
  for (let round = 0; round < 100; round++) await context.initializeMaps();
  assert.equal(creates, 1000, 'Existing markers must be reused');
  assert.equal(fits, 1, 'Updates must not repeatedly zoom the map');
  assert.equal(updates, 99000);
  people.length = 0;
  await context.initializeMaps();
  assert.equal(removes, 1000);
  assert.equal(context.leafletInstances['test-map'].markers.size, 0);
  results.push({ scenario: '1000 markers x 100 updates then expiry', creates, updates, removes, fits, ms: Math.round(performance.now() - started) });

  let queries = 0, release;
  const blocked = new Promise(resolve => { release = resolve; });
  const recovery = vm.createContext({
    locationRecoveryRunning: false, session: { userId: 'self' }, document: { hidden: false }, activeTab: 'map', console,
    loadSupabaseLocations: async () => { queries++; await blocked; }, refreshMapDetails() {}, initializeMaps() {},
  });
  vm.runInContext(fn('recoverSupabaseLocations'), recovery);
  const attempts = Array.from({ length: 100 }, () => recovery.recoverSupabaseLocations());
  assert.equal(queries, 1, 'Recovery must not flood the database');
  release();
  await Promise.all(attempts);
  assert.equal(recovery.locationRecoveryRunning, false);
  results.push({ scenario: '100 overlapping recovery attempts', queries });
  console.log(JSON.stringify({ scope: 'Local production logic; mocked DOM, storage and network; not device/server capacity', results }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
