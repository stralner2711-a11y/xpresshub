const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js', 'utf8');
function fn(name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'));
  assert(start >= 0, name);
  const rest = source.slice(start);
  return rest.slice(0, rest.indexOf('\n}\n') + 2);
}
(async () => {
  const mapper = fs.readFileSync('src/modules/supabase-client.js','utf8').replace(/export /g,'');
  const ctx = vm.createContext({});
  vm.runInContext(mapper,ctx);
  const mapped = ctx.profileFromSupabaseRow({full_name:'New colleague',access_role:'employee'}, {email:'test@example.com'}, null);
  assert.equal(mapped.emergencyContact,'');
  assert.equal(mapped.email,'test@example.com');
  assert.doesNotThrow(()=>ctx.profileFromSupabaseRow(null,null,null));

  const c = vm.createContext({session:{userId:'self',mode:'supabase'}, normalizeEmployeeEmail:x=>x||''});
  vm.runInContext(fn('employeeOnboardingState'),c);
  assert.equal(c.employeeOnboardingState({id:'other',email:'a@example.com',employmentStatus:'active'}).key,'ready');
  assert.equal(c.employeeOnboardingState({id:'other',email:'a@example.com',employmentStatus:'paused'}).key,'approval-pending');

  const received=[];
  const recovery=vm.createContext({chatRecoveryRunning:false,session:{userId:'self'},document:{hidden:false},chats:[{id:'private'}],console,
    getSupabaseClient:()=>({from:()=>({select:()=>({eq:()=>({order:()=>({limit:async()=>({data:[{id:2},{id:1}]})})})})})}),
    handleSupabaseMessage:async row=>received.push(row.id)});
  vm.runInContext(fn('recoverSupabaseMessages'),recovery);
  await recovery.recoverSupabaseMessages();
  assert.deepEqual(received,[1,2]);

  const current={innerHTML:'0'}, list={innerHTML:'empty'}, stats={innerHTML:'old'};
  const blocks={'.map-hero-card span':current,'.map-people':list,'.work-status-strip':stats};
  const map=vm.createContext({document:{createElement:()=>({innerHTML:'',querySelector:s=>({innerHTML:s})}),querySelector:s=>blocks[s]},renderMap:()=>'<test />'});
  vm.runInContext(fn('refreshMapDetails'),map);
  map.refreshMapDetails();
  assert.equal(list.innerHTML,'.map-people');
  assert(!fn('refreshMapDetails').includes('initializeMaps'), 'Text refresh must not rebuild map');
  const locationCalls=[];
  const locationContext=vm.createContext({locationRecoveryRunning:false,session:{userId:'self'},document:{hidden:false},activeTab:'map',console,
    loadSupabaseLocations:async()=>locationCalls.push('reload'),refreshMapDetails:()=>locationCalls.push('details'),initializeMaps:()=>locationCalls.push('markers')});
  vm.runInContext(fn('recoverSupabaseLocations'),locationContext);
  await locationContext.recoverSupabaseLocations();
  assert.deepEqual(locationCalls,['reload','details','markers']);
  locationContext.document.hidden=true;
  await locationContext.recoverSupabaseLocations();
  assert.equal(locationCalls.length,3);
  assert(source.includes('setInterval(recoverSupabaseLocations, 30000)'));
  assert(source.includes('email: profile.email || employee.email || session?.email'));
  assert(!source.includes('const activeEmployees = employees.filter(employee => employee.employmentStatus !=='));
  for(const file of ['schema.sql','RUN_THIS_IN_SUPABASE.sql','RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql']){
    assert(fs.readFileSync('supabase/'+file,'utf8').includes('add column if not exists started_location_sharing boolean not null default false'));
  }
  console.log('New profile null, onboarding, recovery, map regions and SQL contract regressions passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
