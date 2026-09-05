const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Execute the actual client functions without network, credentials or accounts.
const source = fs.readFileSync('app.js', 'utf8');
const start = source.indexOf('async function signUpSupabase(');
const end = source.indexOf('function isEmailConfirmationError(', start);
assert(start >= 0 && end > start, 'Signup functions must exist');

function harness({ session = null, active = false, error = null, connected = true } = {}) {
  const calls = [];
  const client = { auth: {
    async signUp(payload) { calls.push(['signup', payload]); return { data: { session }, error }; },
    async resend(payload) { calls.push(['resend', payload]); return { error }; },
  } };
  const context = vm.createContext({
    getSupabaseClient: () => connected ? client : null,
    normalizeEmployeeEmail: value => String(value || '').trim().toLowerCase(),
    officialAppUrl: () => 'https://xpressintra-test.invalid/',
    applySupabaseSession: async value => { calls.push(['session', value]); return active; },
    markSupabasePasswordReady: async () => calls.push(['password-ready']),
    openTemporaryPasswordModal: () => calls.push(['password-modal']),
    openEmailConfirmationModal: email => calls.push(['confirmation', email]),
  });
  vm.runInContext(source.slice(start, end), context);
  return { context, calls };
}

(async () => {
  const options = { fullName: '  Test Chauffor  ', personalPasswordReady: true };
  const fresh = harness();
  const message = await fresh.context.signUpSupabase(' TEST@example.invalid ', 'TestOnly123!', options);
  const payload = fresh.calls[0][1];
  assert.equal(payload.email, 'test@example.invalid');
  assert.equal(payload.options.data.full_name, 'Test Chauffor');
  assert.equal(payload.options.data.requested_xpressintra_access, true);
  assert.equal(payload.options.data.invited_to_xpressintra, false);
  assert.equal(payload.options.data.first_personal_password, true);
  assert.equal(payload.options.data.temporary_password_flow, false);
  assert.equal(payload.options.emailRedirectTo, 'https://xpressintra-test.invalid/');
  assert(!('access_role' in payload.options.data));
  assert(!('employment_status' in payload.options.data));
  assert.equal(fresh.calls[1][0], 'confirmation');
  assert.equal(fresh.calls.length, 2, 'Unconfirmed signup must not open a session');
  assert(message.includes('mail'));

  const pending = harness({ session: { user: { id: 'test-only' } } });
  const pendingMessage = await pending.context.signUpSupabase('test@example.invalid', 'TestOnly123!', options);
  assert(pendingMessage.includes('godkende'));
  assert.deepEqual(pending.calls.map(call => call[0]), ['signup', 'session']);

  const invited = harness();
  await invited.context.signUpSupabase('test@example.invalid', 'TestOnly123!', { ...options, invitationId: 'test-invitation' });
  assert.equal(invited.calls[0][1].options.data.invitation_id, 'test-invitation');
  assert.equal(invited.calls[0][1].options.data.invited_to_xpressintra, true);

  for (const reason of ['SMTP unavailable', 'Email rate limit exceeded', 'Network unavailable']) {
    const failure = harness({ error: new Error(reason) });
    await assert.rejects(failure.context.signUpSupabase('test@example.invalid', 'TestOnly123!', options), { message: reason });
    assert.deepEqual(failure.calls.map(call => call[0]), ['signup'], 'Failure must not show mail-sent confirmation');
    await assert.rejects(failure.context.resendSupabaseSignupConfirmation('test@example.invalid'), { message: reason });
  }

  const resend = harness();
  assert.equal(await resend.context.resendSupabaseSignupConfirmation(' TEST@example.invalid '), 'test@example.invalid');
  assert.equal(resend.calls[0][1].type, 'signup');
  assert.equal(resend.calls[0][1].email, 'test@example.invalid');
  await assert.rejects(resend.context.resendSupabaseSignupConfirmation(''));
  assert.equal(resend.calls.length, 1, 'Empty email must not reach mail service');

  const offline = harness({ connected: false });
  await assert.rejects(offline.context.signUpSupabase('test@example.invalid', 'TestOnly123!', options));
  await assert.rejects(offline.context.resendSupabaseSignupConfirmation('test@example.invalid'));
  assert.equal(offline.calls.length, 0);
  console.log('Isolated signup/mail client tests passed. No network, real accounts or emails. RLS and email-link redemption are not simulated here.');
})().catch(error => { console.error(error); process.exitCode = 1; });
