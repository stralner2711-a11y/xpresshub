const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
const firstAdmin = fs.readFileSync('supabase/first-admin.sql', 'utf8');
const fullBootstrap = fs.readFileSync('supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql', 'utf8');
const resetSql = fs.readFileSync('supabase/RESET_XPRESSINTRA_SUPABASE.sql', 'utf8');
const locationRepair = fs.readFileSync('supabase/REPAIR_LOCATION_SHARES.sql', 'utf8');

[
  'new.department := old.department;',
  'new.license_summary := old.license_summary;',
  'new.role := old.role;',
  'new.access_role := old.access_role;',
  'new.vehicle_type := old.vehicle_type;',
  'new.truck := old.truck;',
  'new.employment_status := old.employment_status;',
  'new.logbook_enabled := old.logbook_enabled;',
].forEach(line => assert(schema.includes(line), `Profile trigger should preserve ${line}`));

[
  'old_department',
  'new_department',
  'old_license_summary',
  'new_license_summary',
  'old_truck',
  'new_truck',
  'old_logbook_enabled',
  'new_logbook_enabled',
].forEach(field => assert(schema.includes(field), `Audit log should include ${field}`));

assert(schema.includes("p.vehicle_type = 'truck' or p.role ilike '%lastbil%' or p.license_summary ilike '%C/E%'"), 'Truck chat should follow documented work function');
assert(fullBootstrap.includes("role = 'Appansvarlig") && fullBootstrap.includes('Lastbilchauff'), 'Creator bootstrap should show Tommy as app responsible truck driver by work function');
assert(fullBootstrap.includes("vehicle_type = 'truck'"), 'Creator bootstrap should grant truck channel through vehicle type');
assert(schema.includes("p.vehicle_type = 'van' or p.role ilike '%varebil%'"), 'Van chat should follow documented work function');
assert(schema.includes('grant usage on schema public to authenticated;'), 'Schema should explicitly expose public schema to authenticated users');
assert(firstAdmin.includes("vehicle_type = 'truck'"), 'First admin helper should grant truck channel through vehicle type');
assert(firstAdmin.includes('license_summary'), 'First admin helper should preserve/set truck driver license summary');
assert(fullBootstrap.includes('GDPR/dataanmodninger') && fullBootstrap.includes('retention/slettefrister') && fullBootstrap.includes('audit-log'), 'Full bootstrap should document the latest GDPR and security package');
assert(fullBootstrap.includes('first-admin.sql'), 'Full bootstrap should include the first-admin helper block');
assert(fullBootstrap.includes('drop table if exists public.location_shares cascade;'), 'Full bootstrap should reset old location shares before a clean install');
assert(fullBootstrap.includes('drop function if exists public.can_read_conversation(uuid) cascade;'), 'Full bootstrap should cascade-drop old public chat access functions');
assert(fullBootstrap.includes('drop schema if exists private cascade;'), 'Full bootstrap should reset private helper schema cleanly');
assert(fullBootstrap.includes('Denne fil nulstiller XpressIntra-tabellerne'), 'Full bootstrap should warn that it resets XpressIntra data');
assert(!fullBootstrap.includes('delete from storage.objects'), 'Full bootstrap must not directly delete from protected Supabase storage.objects');
assert(!fullBootstrap.includes('delete from storage.buckets'), 'Full bootstrap must not directly delete from protected Supabase storage.buckets');
assert(fullBootstrap.includes('add column if not exists audience text not null default'), 'Full bootstrap should repair old tables missing the audience column before policies');
assert(fullBootstrap.includes('add column if not exists auto_delete boolean not null default false'), 'Full bootstrap should repair old retention policies missing auto_delete');
assert(fullBootstrap.includes("notify pgrst, 'reload schema';"), 'Full bootstrap should refresh Supabase/PostgREST schema cache after creating tables');
assert(fullBootstrap.includes('select pg_notification_queue_usage();'), 'Full bootstrap should force Supabase to notice schema-cache notifications');
assert(!fullBootstrap.includes('fix-pickup-live-notes'), 'Full bootstrap should not contain old appended one-off fix sections');
assert((fullBootstrap.match(/create or replace function public\.handle_new_user/g) || []).length === 1, 'Full bootstrap should define handle_new_user only once');
assert((fullBootstrap.match(/create trigger on_auth_user_created/g) || []).length === 1, 'Full bootstrap should create auth user trigger only once');
assert((fullBootstrap.match(/create table if not exists public\.pickup_tasks/g) || []).length === 1, 'Full bootstrap should create pickup_tasks only once');
assert((fullBootstrap.match(/create table if not exists public\.location_shares/g) || []).length === 1, 'Full bootstrap should create location_shares only once');
assert(resetSql.includes('drop table if exists public.location_shares cascade;'), 'Reset SQL should remove old location shares tables before a clean install');
assert(resetSql.includes("to_regclass('public.profiles')"), 'Reset SQL should be safe if profiles does not exist yet');
assert(schema.includes('grant select, insert, update, delete on all tables in schema public to authenticated;'), 'Schema should grant Data API table access after RLS is enabled');
assert(schema.includes('create or replace function public.start_direct_conversation(target_user_id uuid)'), 'Schema should expose a controlled direct chat starter');
assert(schema.includes('grant execute on function public.start_direct_conversation(uuid) to authenticated;'), 'Authenticated users should be able to call the direct chat RPC');
assert(schema.includes('cannot_start_direct_conversation_with_self'), 'Direct chat RPC should reject self conversations');
assert(schema.includes('create table if not exists public.employee_invitations'), 'Schema should support safe employee invitations without exposing service-role keys');
assert(schema.includes('on public.employee_invitations for all to authenticated using (private.is_admin())'), 'Only admins should manage employee invitations');
assert(schema.includes("new.raw_user_meta_data ->> 'first_personal_password'"), 'Auth trigger should understand first-login personal password onboarding');
assert(fullBootstrap.includes("new.raw_user_meta_data ->> 'first_personal_password'"), 'Full bootstrap should include first-login personal password onboarding');
assert(schema.includes('on public.admin_audit_log for insert to authenticated with check (actor_id = auth.uid() and private.is_admin())'), 'Admins should be able to write explicit audit entries as themselves');
assert(schema.includes("insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)"), 'Schema should create a private Storage bucket for media');
assert(schema.includes("public = false"), 'Media bucket should be private');
assert(schema.includes('private.can_read_conversation(messages.conversation_id)'), 'Conversation media should only be readable by users who can read the conversation');
assert(schema.includes("split_part(name, '/', 1) = auth.uid()::text"), 'Users should only upload media under their own storage prefix');
assert(schema.includes('create policy "employees can read shared media objects"'), 'Storage should allow recipients to read shared media through metadata checks');
assert(schema.includes("media_attachments.visibility = 'announcement'"), 'Announcement images should be readable as shared internal media');
assert(schema.includes('alter publication supabase_realtime add table public.location_shares;'), 'Location shares should be available through realtime');
assert(schema.includes("audience text not null default 'all' check (audience in ('all', 'truck', 'van', 'none'))"), 'Location shares should store a clear audience choice');
assert(schema.includes('show_speed boolean not null default false'), 'Location shares should avoid exposing speed by default');
assert(schema.includes('speed_kmh numeric(6, 2) check (speed_kmh is null or speed_kmh >= 0)'), 'Location speed should be nullable for data minimization');
assert(schema.includes("and audience = 'truck'"), 'Location RLS should support truck-only sharing');
assert(schema.includes("and audience = 'van'"), 'Location RLS should support van-only sharing');
assert(schema.includes("or (visibility = 'pickup' and visible_to_user_id = auth.uid())"), 'Pickup location sharing should only be visible to the selected colleague');
assert(schema.includes('on public.location_shares for delete to authenticated using (user_id = auth.uid() or private.is_admin())'), 'Employees should stop own location sharing while admins can run retention cleanup');
assert(locationRepair.includes('create table if not exists public.location_shares'), 'Location repair SQL should recreate the missing GPS table');
assert(locationRepair.includes("to_regclass('public.profiles') is null"), 'Location repair SQL should clearly stop if the base profiles table has not been installed');
assert(locationRepair.includes('RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql'), 'Location repair SQL should point users to the full base install when profiles is missing');
assert(locationRepair.includes('alter table public.location_shares enable row level security;'), 'Location repair SQL should keep RLS enabled');
assert(locationRepair.includes('grant select, insert, update, delete on public.location_shares to authenticated;'), 'Location repair SQL should grant Data API access for authenticated users');
assert(locationRepair.includes("notify pgrst, 'reload schema';"), 'Location repair SQL should refresh PostgREST schema cache');
assert(locationRepair.includes('alter publication supabase_realtime add table public.location_shares;'), 'Location repair SQL should restore realtime GPS updates');
assert(schema.includes('auto_delete boolean not null default false'), 'Retention policies should track automatic cleanup choices');
assert(schema.includes('create or replace function public.purge_expired_operational_data()'), 'Schema should include an admin cleanup function for expired operational data');
assert(schema.includes('grant execute on function public.purge_expired_operational_data() to authenticated;'), 'Authenticated admins should be able to call cleanup through RLS/function checks');
assert(schema.includes('create policy "admins can delete expired pickup tasks"'), 'Admins should be able to clean up expired pickup tasks without reading private chats');
assert(schema.includes("status text not null default 'active' check (status in ('active', 'ended', 'auto_ended'))"), 'Workday sessions should support active, ended, and auto-ended states');
assert(schema.includes('on public.workday_sessions for insert to authenticated with check (user_id = auth.uid())'), 'Employees should only start their own workday sessions');
assert(schema.includes('on public.workday_sessions for update to authenticated using (user_id = auth.uid())'), 'Employees should only end their own workday sessions');
assert(schema.includes('expires_at timestamptz'), 'Pickup tasks should store automatic expiry time online');
assert(schema.includes('alter publication supabase_realtime add table public.pickup_tasks;'), 'Pickup tasks should be available through realtime');
assert(schema.includes('on public.pickup_tasks for select to authenticated using (driver_id = auth.uid() or colleague_id = auth.uid())'), 'Pickup tasks should only be readable by driver and selected colleague');
assert(schema.includes('on public.pickup_tasks for insert to authenticated with check (driver_id = auth.uid() and driver_id <> colleague_id)'), 'Employees should only create pickup tasks for another colleague');
assert(schema.includes('on public.pickup_tasks for update to authenticated'), 'Pickup participants should have a controlled update policy');
assert(schema.includes('using (driver_id = auth.uid() or colleague_id = auth.uid())'), 'Both pickup participants should be able to update live notes/status');
assert(schema.includes('alter publication supabase_realtime add table public.announcement_comments;'), 'Announcement comments should be available through realtime');
assert(schema.includes('alter publication supabase_realtime add table public.announcement_reactions;'), 'Announcement reactions should be available through realtime');
assert(schema.includes('alter publication supabase_realtime add table public.notifications;'), 'Notifications should be available through realtime');

console.log('Supabase security smoke test passed');


