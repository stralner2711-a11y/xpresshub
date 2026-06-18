const fs = require('fs');
const vm = require('vm');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([
    ['roadlog:supabaseConfig', JSON.stringify({ url: 'https://demo.supabase.co', anonKey: 'public-anon-key' })],
  ]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const requests = [];

  const document = {
    createElement() { return { className: '', innerHTML: '', classList: { add() {}, remove() {} }, append() {}, remove() {}, addEventListener() {} }; },
    head: { append() {} },
    body: { append() {}, insertAdjacentHTML() {} },
    querySelector(selector) {
      if (selector === '#app') return appElement;
      if (selector === '.toast') return { textContent: '', classList: { add() {}, remove() {} } };
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener() {},
  };

  async function fetch(url, options = {}) {
    requests.push({ url: String(url), options });
    const target = new URL(String(url));
    const json = (status, data) => ({
      ok: status >= 200 && status < 300,
      status,
      text: async () => JSON.stringify(data),
    });

    if (target.pathname === '/auth/v1/token') {
      return json(200, {
        access_token: 'access-token-1',
        refresh_token: 'refresh-token-1',
        user: { id: 'user-1', email: 'driver@example.com' },
      });
    }

    if (target.pathname.startsWith('/rest/v1/')) {
      const table = target.pathname.split('/').pop();
      if (table === 'profiles' && target.searchParams.get('id') === 'eq.user-1') {
        return json(200, [{
          id: 'user-1',
          email: 'driver@example.com',
          full_name: 'Test Chauffør',
          role: 'Lastbilchauffør',
          access_role: 'employee',
          vehicle_type: 'truck',
          employment_status: 'active',
          logbook_enabled: true,
        }]);
      }
      if (table === 'profiles') return json(200, []);
      if (table === 'conversations') return json(200, [{
        id: 'chat-1',
        title: 'Fælleschat · Alle medarbejdere',
        channel_type: 'all',
        created_at: '2026-06-04T06:00:00Z',
      }]);
      if (table === 'messages') return json(200, []);
      return json(200, []);
    }

    return json(404, { message: 'Not found' });
  }

  const context = {
    console,
    document,
    fetch,
    URL,
    URLSearchParams,
    window: {
      document,
      localStorage: null,
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

  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });
  return { requests, run: script => vm.runInContext(script, context) };
}

(async () => {
  const harness = createHarness();
  assert(harness.run('supabaseStatus().ready') === true, 'Supabase should be ready without the CDN client when config exists');
  assert(harness.run('onlineBackendActive()') === true, 'The built-in REST Supabase client should activate online login');
  assert(harness.run('getSupabaseClient().__fallbackRest') === true, 'The app should use the REST fallback client when window.supabase is missing');

  await harness.run("signInSupabase('driver@example.com', 'secret123')");

  assert(harness.requests.some(request => request.url.includes('/auth/v1/token?grant_type=password')), 'Login should call Supabase Auth through REST fallback');
  assert(harness.requests.some(request => request.url.includes('/rest/v1/profiles')), 'Login should load the profile through PostgREST fallback');
  assert(harness.run('session.mode') === 'supabase', 'REST fallback login should create a real Supabase session');
  assert(harness.run('profile.name') === 'Test Chauffør', 'REST fallback login should apply profile data');
  assert(!harness.run("document.querySelector('#app').innerHTML.includes('Supabase skal sættes op')"), 'Login screen should not block production login when fallback client is available');

  console.log('Supabase REST fallback login smoke test passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

