-- XpressIntra reset for Supabase
-- Brug kun denne hvis du vil starte app-databasen helt forfra.
--
-- VIGTIGT:
-- Denne fil sletter XpressIntra-tabeller, policies og funktioner.
-- Den sletter ikke auth.users. Storage-filer slettes ikke direkte, fordi Supabase blokerer direkte delete fra storage-tabeller.
--
-- Rigtig rækkefølge:
-- 1. Kør denne RESET_XPRESSINTRA_SUPABASE.sql.
-- 2. Kør derefter RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql.

do $$
begin
  if to_regclass('public.profiles') is not null then
    drop trigger if exists protect_profile_security_fields on public.profiles;
  end if;

  drop trigger if exists on_auth_user_created on auth.users;
end;
$$;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.start_direct_conversation(uuid) cascade;
drop function if exists public.can_read_conversation(uuid) cascade;
drop function if exists public.is_conversation_member(uuid) cascade;
drop function if exists public.protect_profile_security_fields() cascade;
drop function if exists public.purge_expired_operational_data() cascade;
drop function if exists public.is_dispatcher_or_admin() cascade;
drop function if exists public.is_admin() cascade;

drop table if exists public.notification_preferences cascade;
drop table if exists public.notifications cascade;
drop table if exists public.vehicles cascade;
drop table if exists public.data_subject_requests cascade;
drop table if exists public.retention_policies cascade;
drop table if exists public.legal_acceptances cascade;
drop table if exists public.core_settings cascade;
drop table if exists public.regulatory_updates cascade;
drop table if exists public.regulatory_sources cascade;
drop table if exists public.logbook_automation_settings cascade;
drop table if exists public.private_log_entries cascade;
drop table if exists public.announcement_comments cascade;
drop table if exists public.announcement_reactions cascade;
drop table if exists public.announcements cascade;
drop table if exists public.media_attachments cascade;
drop table if exists public.messages cascade;
drop table if exists public.conversation_members cascade;
drop table if exists public.conversations cascade;
drop table if exists public.pickup_tasks cascade;
drop table if exists public.workday_sessions cascade;
drop table if exists public.location_shares cascade;
drop table if exists public.employee_invitations cascade;
drop table if exists public.admin_audit_log cascade;
drop table if exists public.profile_private_details cascade;
drop table if exists public.profiles cascade;
