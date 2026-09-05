const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js', 'utf8');
function fn(name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'));
  assert(start >= 0);
  const rest = source.slice(start);
  return rest.slice(0, rest.indexOf('\n}\n') + 2);
}
(async () => {
  const timers = new Map(), rows = [], received = new Map();
  let timerId = 0, calls = 0;
  const ctx = vm.createContext({
    session: { userId: 'test' }, document: { hidden: false }, console,
    chatRecoveryRunning: false, chatRecoveryStartupTimers: [], chats: [{id:'test-chat'}],
    setTimeout: (callback, delay) => { const id=++timerId; timers.set(id,{callback,delay}); return id; },
    clearTimeout: id => timers.delete(id),
    getSupabaseClient: () => ({from:()=>({select:()=>({eq:()=>({order:()=>({limit:async()=>{calls++;return {data:[...rows].reverse()};}})})})})}),
    handleSupabaseMessage: async row => received.set(row.id,row),
  });
  vm.runInContext(fn('recoverSupabaseMessages')+'\n'+fn('scheduleChatRecovery'),ctx);
  ctx.scheduleChatRecovery();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(received.size,0);
  rows.push({id:1,body:'Missed initial realtime event'});
  assert.deepEqual([...timers.values()].map(t=>t.delay),[2000,10000,30000]);
  timers.values().next().value.callback();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(received.get(1).body,'Missed initial realtime event');
  ctx.scheduleChatRecovery();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(timers.size,3,'Repeated focus must replace, not multiply, recovery timers');
  assert.equal(received.size,1);
  const before=calls;
  ctx.session=null;
  for(const timer of timers.values())timer.callback();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(calls,before,'Old session timers cannot fetch after logout');
  ctx.session={userId:'test'};ctx.document.hidden=true;
  ctx.scheduleChatRecovery();
  assert.equal(timers.size,0,'Hidden app must not schedule startup polling');
  assert(source.includes("window.addEventListener('online', scheduleChatRecovery)"));
  assert(source.includes("window.addEventListener('focus', scheduleChatRecovery)"));
  console.log('Missed startup event, repeated focus, logout and hidden-app recovery passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
