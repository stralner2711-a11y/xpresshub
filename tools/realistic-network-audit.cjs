const { createClient } = require('@supabase/supabase-js');
const { performance } = require('node:perf_hooks');
const fs = require('node:fs');
const fixtures = JSON.parse(Buffer.from(process.env.XPRESS_QA_FIXTURES || '', 'base64').toString());
if (!/^qa-real-\d+$/.test(fixtures.run) || fixtures.users.length !== 3 || fixtures.users.some(u => !u.email.startsWith(fixtures.run + '-') || !u.email.endsWith('@example.com'))) throw new Error('Isolated fixtures required');
const URL = 'https://mtfbdoajzmlgqbeiubxe.supabase.co';
const KEY = 'sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd';
const make = () => createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
const authClients = [make(), make(), make()], sockets = [], channels = [], checks = [], metrics = {};
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const sessions = [], events = Array.from({ length: 10 }, () => []), sentAt = new Map();
let conversation;
function ok(r) { if (r.error) throw new Error(r.error.message); return r.data; }
function check(name, pass, detail) { checks.push({ name, pass: !!pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${detail || ''}`); }
function stats(values) { const a = [...values].sort((a,b) => a-b); return { samples: a.length, p50Ms: Math.round(a[Math.max(0,Math.ceil(a.length*.5)-1)] || 0), p95Ms: Math.round(a[Math.max(0,Math.ceil(a.length*.95)-1)] || 0), maxMs: Math.round(a.at(-1) || 0) }; }
async function subscribe(client, index) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Subscription ${index} timeout`)), 15000);
    const channel = client.channel(`${fixtures.run}-${index}-${Date.now()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation}` }, payload => {
        events[index].push({ id: payload.new.id, body: payload.new.body, received: performance.now() });
      }).subscribe(status => {
        if (status === 'SUBSCRIBED') { clearTimeout(timer); resolve(channel); }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') { clearTimeout(timer); reject(new Error(`Subscription ${index}: ${status}`)); }
      });
    channels.push({ client, channel });
  });
}
async function main() {
  const loginTimes = [];
  for (let i=0;i<3;i++) {
    const start = performance.now();
    const result = ok(await authClients[i].auth.signInWithPassword({ email: fixtures.users[i].email, password: fixtures.password }));
    loginTimes.push(performance.now()-start); sessions.push(result.session);
  }
  metrics.login = stats(loginTimes);
  conversation = ok(await authClients[0].rpc('start_direct_conversation_v2', { target_user_id: fixtures.users[1].id }));
  if (typeof conversation !== 'string') throw new Error('Invalid private conversation');
  // Eight participant sockets and two outsider sockets; only three identities.
  for (let i=0;i<10;i++) {
    const client = make(); sockets.push(client);
    const session = sessions[i < 8 ? 1 : 2];
    ok(await client.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token }));
    await subscribe(client, i);
    await wait(100);
  }
  check('10 real WebSocket connections subscribed', true, '8 participant, 2 unrelated admin; 3 identities total');
  const readTimes = [];
  for (let batch=0;batch<10;batch++) {
    await Promise.all(Array.from({length:5}, async () => {
      const start=performance.now();
      ok(await authClients[1].from('messages').select('id,body,sender_id,created_at').eq('conversation_id',conversation).limit(500));
      readTimes.push(performance.now()-start);
    }));
    await wait(200);
  }
  metrics.read = stats(readTimes);
  check('50 real private-chat reads', readTimes.length===50, JSON.stringify(metrics.read));
  const writes = [], ids = [];
  for (let i=0;i<30;i++) {
    const body = `${fixtures.run} timed ${i} æøå`;
    const start=performance.now(); sentAt.set(body,start);
    const row=ok(await authClients[i%2].from('messages').insert({conversation_id:conversation,sender_id:fixtures.users[i%2].id,body}).select('id').single());
    writes.push(performance.now()-start); ids.push(row.id);
    await wait(500);
  }
  const deadline=Date.now()+15000;
  while(Date.now()<deadline && events.slice(0,8).some(list=>new Set(list.filter(e=>sentAt.has(e.body)).map(e=>e.id)).size<30)) await wait(200);
  metrics.write=stats(writes);
  const latency=[];
  for(let i=0;i<8;i++) {
    const received=events[i].filter(e=>sentAt.has(e.body));
    check(`Participant socket ${i+1} receives exactly 30 messages`,received.length===30&&new Set(received.map(e=>e.id)).size===30,`${received.length} events`);
    latency.push(...received.map(e=>e.received-sentAt.get(e.body)));
  }
  check('Unrelated admin sockets receive no private messages',events[8].length===0&&events[9].length===0,`${events[8].length+events[9].length} events`);
  metrics.realtime=stats(latency);
  const outsider=ok(await authClients[2].from('messages').select('id').eq('conversation_id',conversation));
  check('Unrelated admin REST cannot read private conversation',outsider.length===0);

  await sockets[0].removeAllChannels();
  const offlineIds=[];
  for(let i=0;i<3;i++) offlineIds.push(ok(await authClients[0].from('messages').insert({conversation_id:conversation,sender_id:fixtures.users[0].id,body:`${fixtures.run} gap ${i}`}).select('id').single()).id);
  await wait(500);
  check('Disconnected socket does not pretend to receive messages',!events[0].some(e=>offlineIds.includes(e.id)));
  await subscribe(sockets[0],0);
  const start=performance.now();
  const recovered=ok(await sockets[0].from('messages').select('*').eq('conversation_id',conversation).order('id',{ascending:false}).limit(500));
  metrics.recoveryMs=Math.round(performance.now()-start);
  check('Latest-500 fetch recovers all three offline messages',offlineIds.every(id=>recovered.some(row=>row.id===id)),`${metrics.recoveryMs} ms`);
  console.log(JSON.stringify(metrics));
}
main().catch(error=>check('Network scenario completed',false,error.message)).finally(async()=>{
  for(const client of sockets) await client.removeAllChannels();
  for(const client of authClients) { await client.removeAllChannels(); await client.auth.signOut({scope:'local'}); }
  const report={at:new Date().toISOString(),run:fixtures.run,scope:'Real production network; bounded 3 test identities and 10 sockets, not 100 users',conversation,checks,metrics,failed:checks.filter(c=>!c.pass).length};
  fs.writeFileSync('qa/realistic-network-results-2026-09-05.json',JSON.stringify(report,null,2));
  process.exitCode=report.failed?1:0;
});
