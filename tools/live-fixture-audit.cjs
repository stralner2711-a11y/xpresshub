const { createClient } = require('@supabase/supabase-js');
const fs = require('node:fs');
const fixtures = JSON.parse(Buffer.from(process.env.XPRESS_QA_FIXTURES, 'base64').toString());
if (fixtures.users.length !== 3 || fixtures.users.some(u => !u.email.startsWith(fixtures.run) || !u.email.endsWith('@example.com'))) throw new Error('Dedicated test fixtures required');
const URL = 'https://mtfbdoajzmlgqbeiubxe.supabase.co';
const KEY = 'sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd';
const clients = fixtures.users.map(() => createClient(URL, KEY, {auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}));
const anon = createClient(URL, KEY, {auth:{persistSession:false,autoRefreshToken:false}});
const [a,b,admin] = clients;
const [A,B,C] = fixtures.users.map(u => u.id);
const results = [], resources = {conversations:[],storage:[]};
const wait = ms => new Promise(r => setTimeout(r,ms));
function check(name, passed, details = '') { results.push({name, passed:!!passed,details}); console.log(`${passed?'PASS':'FAIL'} ${name}${details?' : '+details:''}`); }
function ok(r) { if(r.error) throw new Error(r.error.message); return r.data; }
async function test(name, fn) { try { await fn(); } catch(e) { check(name,false,e.message); } }
async function invisible(client,table,column,id) { const r = await client.from(table).select('*').eq(column,id); return !r.error && r.data.length === 0; }
async function main() {
 for(let i=0;i<3;i++) { const r=await clients[i].auth.signInWithPassword({email:fixtures.users[i].email,password:fixtures.password}); ok(r); check(`Password login fixture ${i+1}`,r.data.user.id===fixtures.users[i].id); }
 await test('Pending account isolation',async()=>{
  const r=await a.from('conversations').select('id'); check('Pending cannot read conversations',!r.error&&r.data.length===0);
  const p=ok(await a.from('profiles').update({employment_status:'active'}).eq('id',A).select()); check('Pending cannot activate itself',p.length===0);
  const rpc=await a.rpc('start_direct_conversation_v2',{target_user_id:B}); check('Pending cannot start conversation',!!rpc.error,rpc.error?.message);
 });
 await test('Admin approval',async()=>{
  for(const [id,vehicle] of [[A,'truck'],[B,'van']]) {const r=await admin.from('profiles').update({employment_status:'active',vehicle_type:vehicle}).eq('id',id).select('id,employment_status');check(`Admin approves ${vehicle}`,!r.error&&r.data?.[0]?.employment_status==='active',r.error?.message);}
 });
 await test('Profile and roles',async()=>{
  const p=ok(await a.from('profiles').update({full_name:'QA temporary truck updated'}).eq('id',A).select()); check('Edit own display name',p[0]?.full_name==='QA temporary truck updated');
  const r=await a.from('profiles').update({access_role:'admin'}).eq('id',A).select();
  const roleAfter=ok(await a.from('profiles').select('access_role').eq('id',A).single());
  check('Employee self-promotion blocked',roleAfter.access_role==='employee',r.error?.message || 'Verified persisted role; trigger may silently preserve employee');
  const other=await a.from('profiles').update({full_name:'QA forbidden overwrite'}).eq('id',B).select();check('Other profile edit blocked',!!other.error||other.data.length===0);
  const inv=await a.from('employee_invitations').insert({created_by:A,email:fixtures.run+'-forbidden@example.com',full_name:'QA forbidden'});check('Employee cannot invite',!!inv.error,inv.error?.message);
  const audit=await a.from('admin_audit_log').select('id').limit(1);check('Employee cannot read admin audit',!audit.error&&audit.data.length===0);
  const telemetry=await a.from('app_telemetry_daily').select('event_count').limit(1);check('Employee cannot read creator telemetry',!telemetry.error&&telemetry.data.length===0);
  const channels=ok(await a.from('conversations').select('channel_type').neq('channel_type','direct'));check('Truck sees truck and all only',channels.some(x=>x.channel_type==='truck')&&channels.some(x=>x.channel_type==='all')&&!channels.some(x=>x.channel_type==='van'));
  const vanChannels=ok(await b.from('conversations').select('channel_type').neq('channel_type','direct'));check('Van cannot see truck channel',!vanChannels.some(x=>x.channel_type==='truck'));
 });
 let conversation;
 await test('Direct conversation concurrency',async()=>{
  const rs=await Promise.all(Array.from({length:4},()=>a.rpc('start_direct_conversation_v2',{target_user_id:B})));
  const ids=rs.filter(r=>!r.error&&typeof r.data==='string').map(r=>r.data);resources.conversations.push(...new Set(ids));conversation=ids[0];
  check('RPC returns valid conversations',ids.length===4,rs.find(r=>r.error)?.error?.message);
  check('Concurrent start creates one conversation',new Set(ids).size===1,`distinct=${new Set(ids).size}`);
  if(!conversation) throw new Error('No conversation');
  check('Participant sees direct conversation',!await invisible(b,'conversations','id',conversation));
  check('Unrelated admin cannot see private conversation',await invisible(admin,'conversations','id',conversation));
 });
 let message;
 await test('Direct chat and realtime',async()=>{
  if(!conversation) throw new Error('No conversation');
  const events=[];let subscribed=false;
  const channel=b.channel(fixtures.run).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`conversation_id=eq.${conversation}`},p=>events.push(p.new)).subscribe(s=>{if(s==='SUBSCRIBED')subscribed=true;});
  try {
   for(let i=0;i<100&&!subscribed;i++)await wait(100);
   check('Realtime subscription established',subscribed);
   message=ok(await a.from('messages').insert({conversation_id:conversation,sender_id:A,body:fixtures.run+' test: æøå ÆØÅ 👍'}).select().single());
   for(let i=0;i<300&&!events.length;i++)await wait(100);
   await wait(500);
   check('Message delivered live exactly once',events.filter(x=>x.id===message.id).length===1,`events=${events.length}`);
   const received=ok(await b.from('messages').select('id,body,sender_id,created_at').eq('id',message.id).single());check('Text sender and timestamp preserved',received.sender_id===A&&received.body===message.body&&!!Date.parse(received.created_at));
   check('Unrelated admin cannot read private message',await invisible(admin,'messages','id',message.id));
   const upd=await b.from('messages').update({body:'QA forbidden'}).eq('id',message.id).select();check('Recipient cannot overwrite sender message',!!upd.error||upd.data.length===0);
   const del=await b.from('messages').delete().eq('id',message.id).select();check('Recipient cannot delete sender message',!!del.error||del.data.length===0);
   const forged=await b.from('messages').insert({conversation_id:conversation,sender_id:A,body:'QA forged'});check('Forged message sender blocked',!!forged.error);
   const outsider=await admin.from('messages').insert({conversation_id:conversation,sender_id:C,body:'QA forbidden outsider'});check('Admin cannot send into private conversation',!!outsider.error);
   const anonymous=await anon.from('messages').insert({conversation_id:conversation,sender_id:A,body:'QA anonymous'});check('Anonymous message insert blocked',!!anonymous.error);
  } finally { await b.removeChannel(channel); }
 });
 await test('Workday and private logbook',async()=>{
  const wd=ok(await a.from('workday_sessions').insert({user_id:A,ends_at:new Date(Date.now()+3600000).toISOString(),permissions:{location:false,qa:fixtures.run}}).select().single());check('Start workday',!!wd.id);
  check('Colleague cannot read private workday',await invisible(b,'workday_sessions','id',wd.id));
  const ended=ok(await a.from('workday_sessions').update({status:'ended',ended_at:new Date().toISOString()}).eq('id',wd.id).select().single());check('End workday',ended.status==='ended');
  const log=ok(await a.from('private_log_entries').insert({user_id:A,place:'QA synthetic place',note:fixtures.run,source:'manual'}).select().single());check('Save personal logbook',!!log.id);
  check('Colleague cannot read personal logbook',await invisible(b,'private_log_entries','id',log.id));check('Admin cannot read personal logbook',await invisible(admin,'private_log_entries','id',log.id));
  const removed=ok(await a.from('private_log_entries').delete().eq('id',log.id).select());check('Delete own log entry',removed.length===1);
 });
 await test('Pickup live notes',async()=>{
  const task=ok(await a.from('pickup_tasks').insert({driver_id:A,colleague_id:B,note:fixtures.run,pickup_place:'QA synthetic location'}).select().single());check('Create pickup task',!!task.id);
  const r=ok(await b.from('pickup_tasks').update({note:fixtures.run+' recipient note',status:'found'}).eq('id',task.id).select().single());check('Recipient updates pickup note',r.note.endsWith('recipient note'));
  check('Outsider admin cannot read pickup',await invisible(admin,'pickup_tasks','id',task.id));
  const swapped=await b.from('pickup_tasks').update({driver_id:C}).eq('id',task.id).select();check('Participant cannot silently replace other participant',!!swapped.error||swapped.data.length===0);
  if(!swapped.error&&swapped.data.length)ok(await b.from('pickup_tasks').update({driver_id:A}).eq('id',task.id));
 });
 await test('GPS visibility and stop',async()=>{
  const gps={user_id:A,latitude:0,longitude:0,visibility:'pickup',visible_to_user_id:B,audience:'none',share_mode:'pickup',last_updated_at:new Date().toISOString(),expires_at:new Date(Date.now()+600000).toISOString()};
  ok(await a.from('location_shares').upsert(gps));check('Designated colleague sees synthetic GPS',!await invisible(b,'location_shares','user_id',A));check('Other users cannot see pickup GPS',await invisible(admin,'location_shares','user_id',A));
  ok(await a.from('location_shares').update({last_updated_at:new Date(Date.now()-960000).toISOString()}).eq('user_id',A));check('Stale GPS is hidden',await invisible(b,'location_shares','user_id',A));
  ok(await a.from('location_shares').update({last_updated_at:new Date().toISOString(),expires_at:new Date(Date.now()-1000).toISOString()}).eq('user_id',A));check('Expired GPS is hidden',await invisible(b,'location_shares','user_id',A));
  ok(await a.from('location_shares').delete().eq('user_id',A));check('Stop sharing removes GPS',await invisible(b,'location_shares','user_id',A));
 });
 await test('Storage image and private attachment',async()=>{
  const path=`${A}/${fixtures.run}.png`;resources.storage.push({user:0,path});
  const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL5kAAAAASUVORK5CYII=','base64');
  ok(await a.storage.from('xpressintra-media').upload(path,bytes,{contentType:'image/png'}));check('Upload valid PNG',true);
  const m=await a.from('media_attachments').insert({owner_id:A,message_id:message.id,storage_path:path,file_name:'qa.png',mime_type:'image/png',size_bytes:bytes.length,visibility:'conversation'}).select().single();ok(m);check('Attach image to private message',true);
  const download=await b.storage.from('xpressintra-media').download(path);check('Recipient can download private image',!download.error,download.error?.message);
  const outsider=await admin.storage.from('xpressintra-media').download(path);check('Unrelated admin cannot download private image',!!outsider.error);
  const wrongPath=`${B}/${fixtures.run}-forged.png`;const wrong=await a.storage.from('xpressintra-media').upload(wrongPath,bytes,{contentType:'image/png'});check('Cannot upload to other user folder',!!wrong.error);if(!wrong.error)resources.storage.push({user:1,path:wrongPath});
  const invalidPath=`${A}/${fixtures.run}.txt`;const invalid=await a.storage.from('xpressintra-media').upload(invalidPath,Buffer.from('QA'),{contentType:'text/plain'});check('Non-image file rejected',!!invalid.error);if(!invalid.error)resources.storage.push({user:0,path:invalidPath});
 });
 await test('Notifications and preferences',async()=>{
  const n=ok(await a.from('notifications').insert({user_id:A,type:'qa',title:'QA temporary',body:fixtures.run,category:'chat'}).select().single());check('Own notification stored',!!n.id);
  check('Colleague cannot read notification',await invisible(b,'notifications','id',n.id));
  const marked=ok(await a.from('notifications').update({read_at:new Date().toISOString()}).eq('id',n.id).select().single());check('Notification marked read',!!marked.read_at);
  const spoof=await a.from('notifications').insert({user_id:B,type:'qa',title:'QA forbidden',body:fixtures.run});check('Employee cannot spoof other notification',!!spoof.error);
  const pref=await a.from('notification_preferences').upsert({user_id:A,location_audience:'none'}).select();check('Privacy preference saves',!pref.error,pref.error?.message);
 });
 await test('Admin pause revokes existing access',async()=>{
  ok(await admin.from('profiles').update({employment_status:'paused'}).eq('id',A));
  if(conversation)check('Existing employee token loses chat access when paused',await invisible(a,'conversations','id',conversation));
  ok(await admin.from('profiles').update({employment_status:'active'}).eq('id',A));
 });
}
main().catch(e=>check('Fatal test error',false,e.message)).finally(async()=>{
 for(const file of resources.storage){try{const r=await clients[file.user].storage.from('xpressintra-media').remove([file.path]);check(`Cleanup storage ${file.path}`,!r.error,r.error?.message);}catch(e){check('Storage cleanup',false,e.message);}}
 for(const c of clients){await c.removeAllChannels();await c.auth.signOut({scope:'local'});}
 const report={run:fixtures.run,at:new Date().toISOString(),users:fixtures.users.map(({id,email})=>({id,email})),resources,results,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length};
 fs.writeFileSync(process.env.XPRESS_QA_REPORT || 'qa/live-fixture-results-2026-09-05.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({passed:report.passed,failed:report.failed,resources}));
 process.exitCode=report.failed?1:0;
});
