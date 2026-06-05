const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const supabaseModule = fs.readFileSync('src/modules/supabase-client.js', 'utf8');
  const storage = new Map([
    ['roadlog:supabaseConfig', JSON.stringify({ url: 'https://demo.supabase.co', anonKey: 'public-anon-key' })],
  ]);
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const modalNodes = [];

  const document = {
    createElement() { return { className: '', innerHTML: '', dataset: {}, classList: { add() {}, remove() {} }, append() {}, remove() {}, addEventListener() {} }; },
    head: { append() {} },
    body: { append(node) { modalNodes.push(node); }, insertAdjacentHTML() {} },
    querySelector(selector) {
      if (selector === '#app') return appElement;
      if (selector === '.toast') return { textContent: '', classList: { add() {}, remove() {} } };
      if (selector === '.message-form input[name="message"]') return { value: '', focus() {} };
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener(type, handler) { this.handlers[type] = handler; },
    handlers: {},
    dispatchEvent(event) {
      return this.handlers[event.type]?.(event);
    },
  };

  let createClientCalled = false;
  const insertedRows = [];
  const rpcCalls = [];
  const subscriptions = [];
  const uploads = [];
  const upserts = [];
  const deletes = [];
  const updates = [];
  const resendCalls = [];
  const signUpCalls = [];
  const fakeClient = {
    auth: {
      getSession() { return Promise.resolve({ data: { session: null }, error: null }); },
      signOut() { return Promise.resolve({ error: null }); },
      signInWithPassword() {
        return Promise.resolve({
          data: { session: { user: { id: 'user-1', email: 'driver@example.com' } } },
          error: null,
        });
      },
      signUp(payload) {
        signUpCalls.push(payload);
        return Promise.resolve({ data: { session: null, user: { email: payload.email } }, error: null });
      },
      resend(payload) {
        resendCalls.push(payload);
        return Promise.resolve({ data: {}, error: null });
      },
    },
    channel() {
      const channel = {
        on(event, filter, callback) {
          subscriptions.push({ event, filter, callback });
          return this;
        },
        subscribe() { return this; },
      };
      return channel;
    },
    removeChannel() {},
    storage: {
      from(bucket) {
        return {
          upload(path, file) { uploads.push({ bucket, path, file }); return Promise.resolve({ data: { path }, error: null }); },
          createSignedUrl(path) { return Promise.resolve({ data: { signedUrl: `https://signed.example/${path}` }, error: null }); },
        };
      },
    },
    rpc(name, args) {
      rpcCalls.push({ name, args });
      if (name === 'start_direct_conversation') {
        return Promise.resolve({ data: 'direct-conversation-1', error: null });
      }
      return Promise.resolve({ data: null, error: new Error(`Unknown RPC ${name}`) });
    },
    from(table) {
      return {
        select() { return this; },
        eq() { return this; },
        order() { return this; },
        limit() { return this; },
        upsert(row) { upserts.push({ table, row }); return Promise.resolve({ data: [row], error: null }); },
        update(row) { updates.push({ table, row }); this.updatedRow = row; return this; },
        delete() { this.deleteMode = true; return this; },
        eq(column, value) {
          if (this.deleteMode) deletes.push({ table, column, value });
          return this;
        },
        insert(row) {
          const storedRow = Array.isArray(row) ? row.map((item, index) => ({ id: `${table}-${index + 1}`, ...item }))
            : table === 'messages' ? { id: 99, created_at: '2026-05-31T10:05:00Z', ...row }
            : table === 'workday_sessions' ? { id: 'workday-1', started_at: '2026-05-31T07:00:00Z', ...row }
            : table === 'pickup_tasks' ? { id: 'pickup-1', started_at: '2026-05-31T10:20:00Z', ...row }
            : table === 'announcements' ? { id: 7, created_at: '2026-05-31T11:00:00Z', ...row }
            : { id: 'attachment-1', ...row };
          insertedRows.push({ table, row: storedRow });
          this.insertedRow = storedRow;
          return this;
        },
        maybeSingle() { return Promise.resolve({ data: this.insertedRow || null, error: null }); },
        then(resolve) {
          if (this.insertedRow) return resolve({ data: [this.insertedRow], error: null });
          if (table === 'conversations') {
            return resolve({
              data: [
                { id: '00000000-0000-4000-8000-000000000001', title: 'Fælleschat · Alle medarbejdere', channel_type: 'all', is_group: true, created_at: '2026-05-31T10:00:00Z' },
                { id: 'direct-conversation-1', title: 'Direkte samtale', channel_type: 'direct', is_group: false, created_at: '2026-05-31T10:02:00Z' },
              ],
              error: null,
            });
          }
          if (table === 'messages') {
            return resolve({
              data: [{ id: 1, conversation_id: '00000000-0000-4000-8000-000000000001', sender_id: 'other-user', body: 'Velkommen online', created_at: '2026-05-31T10:01:00Z' }],
              error: null,
            });
          }
          if (table === 'location_shares') {
            return resolve({
              data: [{ user_id: 'target-user-1', latitude: 55.49, longitude: 9.47, speed_kmh: null, visibility: 'team', audience: 'truck', show_speed: false, show_vehicle: true, show_status: true, status: 'driving', share_mode: 'manual', last_updated_at: '2026-05-31T10:03:00Z' }],
              error: null,
            });
          }
          if (table === 'workday_sessions') {
            return resolve({ data: [], error: null });
          }
          if (table === 'pickup_tasks') {
            return resolve({ data: [], error: null });
          }
          return resolve({ data: [], error: null });
        },
      };
    },
  };

  const context = {
    console,
    document,
    window: {
      addEventListener() {},
      scrollTo() {},
      matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} }; },
      supabase: {
        createClient(url, key) {
          createClientCalled = url === 'https://demo.supabase.co' && key === 'public-anon-key';
          return fakeClient;
        },
      },
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
    URL,
  };

  context.window.document = document;
  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });
  return { appElement, document, modalNodes, insertedRows, rpcCalls, subscriptions, uploads, upserts, deletes, updates, resendCalls, signUpCalls, createClientWasCalled: () => createClientCalled, run: script => vm.runInContext(script, context) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const app = fs.readFileSync('src/app.js', 'utf8');
  const supabaseModule = fs.readFileSync('src/modules/supabase-client.js', 'utf8');
  assert(app.includes('XpressIntraSupabaseClient?.resolveSupabaseConfig'), 'App should delegate Supabase config resolution to the module when loaded');
  assert(app.includes('XpressIntraSupabaseClient?.profileFromSupabaseRow'), 'App should delegate Supabase profile mapping to the module when loaded');
  assert(supabaseModule.includes('export function resolveSupabaseConfig'), 'Supabase module should export config resolution');
  assert(supabaseModule.includes('export function profileFromSupabaseRow'), 'Supabase module should export profile mapping');
  assert(supabaseModule.includes('globalThis.XpressIntraSupabaseClient'), 'Supabase module should expose a browser global for the app wrapper');

  const harness = createHarness();

  assert(harness.run('supabaseStatus().ready') === true, 'Supabase should be ready when URL and anon key are configured');
  assert(harness.createClientWasCalled(), 'Supabase client should be created with configured public values');
  assert(!harness.appElement.innerHTML.includes('Test Supabase'), 'Login screen should hide creator diagnostics from employees');
  assert(!harness.appElement.innerHTML.includes('Rigtigt medarbejderlogin er aktivt'), 'Login screen should hide backend status from employees');
  assert(harness.run("profileFromSupabase({ full_name: 'Test Chauffør', access_role: 'employee', vehicle_type: 'truck', logbook_enabled: true }, { email: 'test@example.com' }, null).name") === 'Test Chauffør', 'Supabase profile rows should map to app profiles');

  assert(harness.run("isMissingSupabaseTableError({ code: 'PGRST205', message: \"Could not find the table 'public.location_shares' in the schema cache\" }, 'location_shares')") === true, 'Supabase schema-cache errors should be recognized for location shares');
  assert(harness.run("handleLocationShareSchemaError({ code: 'PGRST205', message: \"Could not find the table 'public.location_shares' in the schema cache\" }); supabaseSchemaState.missingLocationShares") === true, 'Missing location_shares should switch GPS to local-only mode instead of repeated hard failures');

  await harness.run("signInSupabase('driver@example.com', 'secret123')");
  assert(harness.run('chats.some(chat => chat.community && chat.preview === "Velkommen online")'), 'Supabase conversations and messages should load into chat');
  assert(harness.subscriptions.some(item => item.filter?.table === 'messages'), 'Chat should subscribe to realtime message inserts');
  assert(harness.subscriptions.some(item => item.filter?.table === 'notifications'), 'App should subscribe to realtime notification inserts');

  harness.run("activeChat = '00000000-0000-4000-8000-000000000001'");
  await harness.document.dispatchEvent({
    type: 'submit',
    preventDefault() {},
    target: {
      matches(selector) { return selector === '.message-form'; },
      elements: { message: { value: 'Hej online' }, image: { files: [] } },
    },
  });
  assert(harness.insertedRows.some(item => item.table === 'messages' && item.row.body === 'Hej online'), 'Sending chat should insert a Supabase message');

  await harness.run("employees.push({ id: 'target-user-1', name: 'Mads Andersen', initials: 'MA', employmentStatus: 'active' }); startSupabaseDirectChat(employees.find(item => item.id === 'target-user-1'), 'Direkte hej')");
  assert(harness.rpcCalls.some(item => item.name === 'start_direct_conversation' && item.args.target_user_id === 'target-user-1'), 'Direct chats should be created through the safe Supabase RPC');
  assert(harness.insertedRows.some(item => item.table === 'messages' && item.row.conversation_id === 'direct-conversation-1' && item.row.body === 'Direkte hej'), 'Starting a direct chat should send the first message online');

  await harness.run("activeChat = 'direct-conversation-1'");
  await harness.document.dispatchEvent({
    type: 'submit',
    preventDefault() {},
    target: {
      matches(selector) { return selector === '.message-form'; },
      elements: {
        message: { value: '' },
        image: { value: '', files: [{ name: 'fragt.jpg', type: 'image/jpeg', size: 1234 }] },
      },
    },
  });
  assert(harness.uploads.some(item => item.bucket === 'xpressintra-media' && item.path.includes('/chat/direct-conversation-1/')), 'Chat images should upload to private Storage under the sender path');
  assert(harness.insertedRows.some(item => item.table === 'media_attachments' && item.row.message_id === 99 && item.row.visibility === 'conversation'), 'Chat images should create a conversation media attachment');

  harness.run("workdayPrivacy = { ...workdayPrivacy, showSpeed: false, audience: 'truck', showVehicle: false, showStatus: false }; location = { ...location, sharing: true, coords: [56.1055, 10.0065], speed: 42, shareMode: '30 min', expiresAt: '2026-05-31T19:00:00Z' }");
  await harness.run('syncSupabaseLocation()');
  assert(harness.upserts.some(item => item.table === 'location_shares' && item.row.user_id === 'user-1' && item.row.speed_kmh === null && item.row.audience === 'truck' && item.row.show_vehicle === false), 'Online GPS sharing should respect privacy choices and avoid storing hidden speed');
  harness.run("workdayPrivacy = { ...workdayPrivacy, showSpeed: true, audience: 'all', showVehicle: true, showStatus: true };");
  await harness.run('syncSupabaseLocation()');
  assert(harness.upserts.some(item => item.table === 'location_shares' && item.row.user_id === 'user-1' && item.row.speed_kmh === 42 && item.row.audience === 'all'), 'Online GPS sharing should include speed only when the user allows it');
  assert(harness.subscriptions.some(item => item.filter?.table === 'location_shares'), 'Live map should subscribe to realtime location changes');
  await harness.run('stopSupabaseLocation()');
  assert(harness.deletes.some(item => item.table === 'location_shares' && item.column === 'user_id' && item.value === 'user-1'), 'Stopping GPS should delete the online location share');

  await harness.run('startWorkday()');
  assert(harness.insertedRows.some(item => item.table === 'workday_sessions' && item.row.user_id === 'user-1' && item.row.status === 'active'), 'Starting workday should create an online workday session');
  await harness.run("endWorkday('Test slut', 'auto_ended')");
  assert(harness.updates.some(item => item.table === 'workday_sessions' && item.row.status === 'auto_ended'), 'Ending workday should update the online workday session');

  harness.run("activePickup = { employeeId: 'target-user-1', note: 'Hent palle i Kolding', duration: '30', pickupPlace: 'Kolding terminal', dropoffPlace: 'Hasselager', reference: 'REF-42', priority: 'Haster', status: 'started', checklist: pickupChecklistItems().map(item => ({ ...item, done: item.id === 'route' })), steps: [{ status: 'started', at: '2026-05-31T10:20:00Z' }], expiresAt: '2099-05-31T10:50:00Z', startedAt: '2026-05-31T10:20:00Z', startedLocationSharing: true }");
  await harness.run('createSupabasePickupTask()');
  assert(harness.insertedRows.some(item => item.table === 'pickup_tasks' && item.row.driver_id === 'user-1' && item.row.colleague_id === 'target-user-1' && item.row.expires_at === '2099-05-31T10:50:00Z'), 'Starting a pickup task should create an online task with expiry and colleague access');
  assert(harness.run("activePickup.id") === 'pickup-1', 'Created online pickup task should store its Supabase id locally');
  await harness.run("updatePickupStatus('found')");
  assert(harness.updates.some(item => item.table === 'pickup_tasks' && item.row.status === 'found'), 'Changing pickup status should update the online pickup task');
  await harness.run("togglePickupChecklist('message')");
  assert(harness.updates.some(item => item.table === 'pickup_tasks' && item.row.checklist.some(check => check.id === 'message' && check.done)), 'Pickup checklist changes should sync online');
  await harness.run('finishPickup()');
  assert(harness.updates.some(item => item.table === 'pickup_tasks' && item.row.status === 'delivered' && item.row.completed_at), 'Finishing a pickup should close the online pickup task');
  assert(harness.subscriptions.some(item => item.filter?.table === 'pickup_tasks'), 'Pickup tasks should subscribe to realtime changes');

  harness.run("profile = { ...profile, name: 'Chef Test', role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch' }");
  await harness.run("updateSupabaseEmployeeProfile({ id: 'target-user-1', name: 'Mads Andersen', phone: '+45 20 11 40 44', email: 'mads@example.com', department: 'Varebil', license: 'B', languages: 'Dansk', role: 'Chauffør', accessRole: 'employee', vehicleType: 'van', truck: 'VB 51 204', employmentStatus: 'offboarded', logbook: true, emergencyContact: 'Sofie' })");
  assert(harness.updates.some(item => item.table === 'profiles' && item.row.employment_status === 'offboarded' && item.row.access_role === 'employee'), 'Admin profile changes should update Supabase profiles');
  assert(harness.upserts.some(item => item.table === 'profile_private_details' && item.row.user_id === 'target-user-1'), 'Admin profile changes should upsert private profile details separately');
  await harness.run("coreSettings = { gps: false, media: true, logbook: true, employeePosts: false, ruleApproval: true }; syncSupabaseCoreSettings()");
  assert(harness.upserts.some(item => item.table === 'core_settings' && Array.isArray(item.row) && item.row.some(row => row.key === 'gps' && row.enabled === false && row.updated_by === 'user-1')), 'Core settings should sync online with admin actor');
  await harness.run("createSupabaseEmployeeInvitation({ name: 'Ny Medarbejder', email: 'ny@example.com', phone: '+45 10 10 10 10', role: 'Chauffør', accessRole: 'employee', vehicleType: 'truck', truck: 'TR 99', department: 'Lastbil', license: 'C/E', languages: 'Dansk', emergencyContact: 'Kontakt', logbook: true })");
  assert(harness.insertedRows.some(item => item.table === 'employee_invitations' && item.row.created_by === 'user-1' && item.row.email === 'ny@example.com'), 'New online employees should be created as safe admin invitations');
  const signupMessage = await harness.run("signUpSupabase(' NY@example.com ', 'Person123', { personalPasswordReady: true })");
  assert(harness.signUpCalls.some(call => call.email === 'ny@example.com' && call.options.emailRedirectTo === 'https://xpresshub-seven.vercel.app/'), 'Signup should ask Supabase to generate confirmation email with XpressIntra redirect');
  assert(signupMessage.includes('Bekræftelsesmail er sendt'), 'Signup without session should explain that confirmation email was generated');
  assert(harness.modalNodes.some(node => node.innerHTML.includes('Mailbekræftelse') && node.dataset.confirmationEmail === 'ny@example.com'), 'Signup without session should open the email confirmation helper');
  await harness.run("resendSupabaseSignupConfirmation(' NY@example.com ')");
  assert(harness.resendCalls.some(call => call.type === 'signup' && call.email === 'ny@example.com' && call.options.emailRedirectTo === 'https://xpresshub-seven.vercel.app/'), 'Admin should be able to resend signup confirmation email with XpressIntra redirect');
  await harness.run("syncSupabaseAdminAudit('Kernefunktioner opdateret', 'GPS fra')");
  assert(harness.insertedRows.some(item => item.table === 'admin_audit_log' && item.row.actor_id === 'user-1' && item.row.details.title === 'Kernefunktioner opdateret'), 'Admin actions should create online audit log entries');

  await harness.run("createSupabaseAnnouncement({ title: 'Ny kontorbesked', body: 'Husk dokumentation', kind: 'office', audience: 'Alle medarbejdere', pinned: false })");
  assert(harness.insertedRows.some(item => item.table === 'announcements' && item.row.author_id === 'user-1' && item.row.audience === 'all'), 'Announcements should be created online with the current author');
  await harness.run("notifySupabaseAudience({ title: 'Ny kontorbesked', body: 'Husk dokumentation', kind: 'office', audience: 'Alle medarbejdere' })");
  assert(harness.insertedRows.some(item => item.table === 'notifications' && Array.isArray(item.row) && item.row.some(row => row.user_id === 'target-user-1' && row.category === 'office')), 'Office announcements should create online audience notifications');
  await harness.run("syncSupabaseAnnouncementReaction('7', true)");
  assert(harness.insertedRows.some(item => item.table === 'announcement_reactions' && item.row.announcement_id === 7 && item.row.user_id === 'user-1'), 'Announcement likes should sync online');
  await harness.run("createSupabaseAnnouncementComment('7', 'Tak for info')");
  assert(harness.insertedRows.some(item => item.table === 'announcement_comments' && item.row.announcement_id === 7 && item.row.body === 'Tak for info'), 'Announcement comments should sync online');
  await harness.run("notificationPrefs = { office: false, rules: true, chat: true, dailyBrief: false, quietHours: true }; syncSupabaseNotificationPrefs()");
  assert(harness.upserts.some(item => item.table === 'notification_preferences' && item.row.user_id === 'user-1' && item.row.office === false), 'Notification preferences should sync online');
  await harness.run("markSupabaseNotificationsRead()");
  assert(harness.updates.some(item => item.table === 'notifications' && item.row.read_at), 'Marking notifications read should update Supabase');
  await harness.run("createSupabaseDataRequest({ requestType: 'access', message: 'Jeg vil se mine data' })");
  assert(harness.insertedRows.some(item => item.table === 'data_subject_requests' && item.row.user_id === 'user-1' && item.row.request_type === 'access'), 'Data requests should be created online');
  await harness.run("legalAcceptance = { date: '31.05.2026', version: '2026-05-31' }; acceptSupabaseLegal()");
  assert(harness.insertedRows.some(item => item.table === 'legal_acceptances' && item.row.user_id === 'user-1' && item.row.policy_version === '2026-05-31'), 'Legal acceptance should sync online');

  console.log('Supabase client smoke test passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});


