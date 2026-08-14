-- Live migration version: 20260814124449.
-- TruckLex belongs to the dedicated Truckpedia project (pfhgchcqddequxhhgrla).
-- Its schema and data were copied and verified there before this cleanup.

do $realtime$
declare
  table_name text;
begin
  foreach table_name in array array[
    'trucklex_audit_log',
    'trucklex_community_posts',
    'trucklex_contributions',
    'trucklex_live_events',
    'trucklex_moderation_queue',
    'trucklex_place_notes',
    'trucklex_places',
    'trucklex_profiles',
    'trucklex_public_sources',
    'trucklex_role_assignments',
    'trucklex_wiki_articles',
    'trucklex_wiki_discussions',
    'trucklex_wiki_revisions'
  ] loop
    if exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format(
        'alter publication supabase_realtime drop table public.%I',
        table_name
      );
    end if;
  end loop;
end
$realtime$;

drop schema if exists trucklex_private cascade;

drop table if exists public.trucklex_audit_log cascade;
drop table if exists public.trucklex_community_posts cascade;
drop table if exists public.trucklex_contributions cascade;
drop table if exists public.trucklex_live_events cascade;
drop table if exists public.trucklex_moderation_queue cascade;
drop table if exists public.trucklex_place_notes cascade;
drop table if exists public.trucklex_places cascade;
drop table if exists public.trucklex_profiles cascade;
drop table if exists public.trucklex_public_sources cascade;
drop table if exists public.trucklex_role_assignments cascade;
drop table if exists public.trucklex_wiki_articles cascade;
drop table if exists public.trucklex_wiki_discussions cascade;
drop table if exists public.trucklex_wiki_revisions cascade;
