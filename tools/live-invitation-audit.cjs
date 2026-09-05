const {createClient}=require('@supabase/supabase-js');
const fs=require('node:fs');
const f=JSON.parse(Buffer.from(process.env.XPRESS_QA_FIXTURES,'base64').toString());
if(!f.run.startsWith('qa-')||f.users.some(u=>!u.email.endsWith('@example.com')))throw Error('Test fixtures only');
const url='https://mtfbdoajzmlgqbeiubxe.supabase.co',key='sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd';
const options={auth:{persistSession:false,autoRefreshToken:false}};
const admin=createClient(url,key,options),signup=createClient(url,key,options);
const report={run:f.run,users:[],invitations:[],results:[]};
const check=(name,passed,details='')=>{report.results.push({name,passed,details});console.log(`${passed?'PASS':'FAIL'} ${name} ${details}`);};
const ok=r=>{if(r.error)throw Error(r.error.message);return r.data;};
(async()=>{
 ok(await admin.auth.signInWithPassword({email:f.users[2].email,password:f.password}));
 for(const scenario of ['valid','expired']){
  const email=`${f.run}-${scenario}@example.com`;
  const invitation=ok(await admin.from('employee_invitations').insert({created_by:f.users[2].id,full_name:'QA invited '+scenario,email,vehicle_type:'truck',expires_at:new Date(Date.now()+(scenario==='valid'?3600000:-3600000)).toISOString()}).select().single());
  report.invitations.push(invitation.id);check(`Admin creates ${scenario} invitation`,true);
  const r=await signup.auth.signUp({email,password:f.password,options:{data:{invitation_id:invitation.id,first_personal_password:true}}});
  if(r.error){check(`Signup ${scenario}`,false,r.error.message);continue;}
  report.users.push({id:r.data.user.id,email});check(`Signup ${scenario}`,!!r.data.user.id);
  const p=ok(await admin.from('profiles').select('full_name,vehicle_type,employment_status,access_role').eq('id',r.data.user.id).single());
  const inv=ok(await admin.from('employee_invitations').select('status,used_by,accepted_at').eq('id',invitation.id).single());
  if(scenario==='valid'){
   check('Valid invite maps intended profile',p.full_name==='QA invited valid'&&p.vehicle_type==='truck');
   check('Valid invite still needs approval',p.employment_status==='paused');
   check('Invite consumed once and bound to user',inv.status==='accepted'&&inv.used_by===r.data.user.id&&!!inv.accepted_at);
  }else{
   check('Expired invite does not grant role or truck channel',p.access_role==='employee'&&p.vehicle_type==='van'&&p.employment_status==='paused');
   check('Expired invite not consumed',inv.status==='pending'&&!inv.used_by&&!inv.accepted_at);
  }
 }
 const bad=await admin.from('employee_invitations').insert({created_by:f.users[2].id,full_name:'QA forbidden owner',email:f.run+'-owner@example.com',access_role:'owner'}).select();
 if(!bad.error)report.invitations.push(...bad.data.map(x=>x.id));check('Admin cannot invite owner role',!!bad.error,bad.error?.message);
})().catch(e=>check('Invitation test failure',false,e.message)).finally(async()=>{
 await admin.auth.signOut({scope:'local'});await signup.auth.signOut({scope:'local'});
 fs.writeFileSync('qa/live-invitation-results-2026-09-05.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({users:report.users,invitations:report.invitations}));
});
