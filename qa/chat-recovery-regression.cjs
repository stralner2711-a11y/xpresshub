const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
function functionSource(name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'));
  assert(start >= 0, `Missing function ${name}`);
  const rest = source.slice(start);
  const end = rest.indexOf('\n}\n');
  assert(end > 0);
  return rest.slice(0, end + 2);
}

async function testRecipient() {
  const inserted = [];
  const id = '11111111-1111-4111-8111-111111111111';
  const ctx = vm.createContext({
    console,
    getSupabaseClient: () => ({ from: () => ({ insert: async row => { inserted.push(row); return {}; } }) }),
    isSupabaseProfileId: value => typeof value === 'string' && /^[0-9a-f-]{36}$/.test(value),
    startDirectConversationRpc: async () => ({ data: null, error: null }),
    loadSupabaseChats: async () => {},
    supabaseAuthSession: () => ({}),
    chats: [{ id, name: 'Unrelated recipient', initials: 'AA', direct: true }],
    messages: {}, session: { userId: 'sender' }, save: () => {}, initialsFromName: () => 'AA',
  });
  vm.runInContext(functionSource('normalizeRpcConversationId') + '\n' + functionSource('startSupabaseDirectChat'), ctx);
  await assert.rejects(ctx.startSupabaseDirectChat({ id, name: 'Another recipient', initials: 'AA' }, 'Keep this draft'));
  assert.equal(inserted.length, 0, 'Missing RPC id must never send to a cached or same-initials recipient');
  ctx.startDirectConversationRpc = async () => ({ data: id, error: null });
  assert.equal(await ctx.startSupabaseDirectChat({ id, name: 'Verified recipient' }, 'Hello'), id);
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].conversation_id, id);
}

async function testHistory(failureMode) {
  let conversations = [{ id: 'busy' }, { id: 'quiet' }];
  const rows = Array.from({ length: 501 }, (_, n) => ({ id: n + 1, conversation_id: 'busy' }));
  rows.push({ id: 1, conversation_id: 'quiet' });
  const restCalls = [];
  const ctx = vm.createContext({
    console: { warn() {} },
    chats: [{ id: 'old' }], messages: { old: [] }, save() {},
    getSupabaseClient: () => ({ from(table) {
      if (table === 'conversations') return { select: () => ({ order: async () => ({ data: conversations }) }) };
      let conversationId, selection; const orders = [];
      const query = {
        select(value) { selection = value; return query; },
        eq(key, value) { assert.equal(key, 'conversation_id'); conversationId = value; return query; },
        order(key, options) { orders.push([key, options.ascending]); return query; },
        async limit(limit) {
          assert.deepEqual(orders, [['created_at', false], ['id', false]]);
          if (failureMode === 'rest' || (failureMode === 'media' && selection !== '*')) return { error: new Error('Network test') };
          return { data: rows.filter(row => row.conversation_id === conversationId).slice().reverse().slice(0, limit) };
        },
      };
      return query;
    } }),
    fetchSupabaseRestRows: async (table, options) => {
      restCalls.push(options);
      assert.equal(table, 'messages');
      assert.equal(options.order, 'created_at.desc,id.desc');
      return rows.filter(row => row.conversation_id === options.conversationId).slice().reverse().slice(0, options.limit);
    },
    attachSignedMediaUrls: async value => value,
    messageFromSupabase: row => row,
    chatFromConversation: row => row,
  });
  vm.runInContext(functionSource('loadSupabaseChats'), ctx);
  await ctx.loadSupabaseChats({ user: { id: 'viewer' } });
  assert.equal(ctx.messages.busy.length, 500);
  assert.equal(ctx.messages.busy[0].id, 2);
  assert.equal(ctx.messages.busy[499].id, 501, 'Latest message must survive reload');
  assert.equal(ctx.messages.quiet.length, 1, 'Busy channels must not hide quiet conversations');
  if (failureMode === 'rest') assert.equal(restCalls.length, 2);
  conversations = [];
  await ctx.loadSupabaseChats({ user: { id: 'viewer' } });
  assert.equal(ctx.chats.length, 0, 'Empty authorized list must clear stale channels');
  assert.equal(Object.keys(ctx.messages).length, 0);
}

(async () => {
  await testRecipient();
  for (const mode of ['normal', 'media', 'rest']) await testHistory(mode);
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const csp = config.headers.flatMap(row => row.headers).find(row => row.key === 'Content-Security-Policy').value;
  const connect = csp.split(';').find(value => value.trim().startsWith('connect-src ')).trim().split(/\s+/);
  for (const host of ['https://raw.githubusercontent.com', 'https://stralner2711-a11y.github.io']) assert(connect.includes(host));
  assert(!connect.includes('*'), 'Do not broaden network access to every origin');
  console.log('Chat recipient, latest history, REST fallback, stale clearing and update CSP regressions passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
