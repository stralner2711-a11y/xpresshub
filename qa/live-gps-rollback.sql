begin;
do $$
declare viewer uuid; sharer uuid;
begin
 select id into viewer from public.profiles where access_role='employee' and employment_status='active' limit 1;
 select id into sharer from public.profiles where access_role='owner' and employment_status='active' limit 1;
 if viewer is null or sharer is null then raise exception 'Missing test roles'; end if;
 perform set_config('qa.viewer',viewer::text,true); perform set_config('qa.sharer',sharer::text,true);
 perform set_config('request.jwt.claim.sub',viewer::text,true);
 insert into public.location_shares(user_id,latitude,longitude,audience,visibility,expires_at,last_updated_at)
 values(sharer,0,0,'all','team',now()+interval '1 hour',now())
 on conflict(user_id) do update set latitude=0,longitude=0,audience='all',visibility='team',expires_at=excluded.expires_at,last_updated_at=now();
end $$;
set local role authenticated;
do $$ begin
 if not exists(select 1 from public.location_shares where user_id=current_setting('qa.sharer')::uuid) then raise exception 'FAIL fresh team location hidden'; end if;
end $$;
reset role;
update public.location_shares set last_updated_at=now()-interval '16 minutes' where user_id=current_setting('qa.sharer')::uuid;
set local role authenticated;
do $$ begin
 if exists(select 1 from public.location_shares where user_id=current_setting('qa.sharer')::uuid) then raise exception 'FAIL stale location exposed'; end if;
end $$;
reset role;
update public.location_shares set last_updated_at=now(),expires_at=now()-interval '1 minute' where user_id=current_setting('qa.sharer')::uuid;
set local role authenticated;
do $$ begin
 if exists(select 1 from public.location_shares where user_id=current_setting('qa.sharer')::uuid) then raise exception 'FAIL expired location exposed'; end if;
end $$;
reset role;
update public.location_shares set expires_at=now()+interval '1 hour',audience='none' where user_id=current_setting('qa.sharer')::uuid;
set local role authenticated;
do $$ begin
 if exists(select 1 from public.location_shares where user_id=current_setting('qa.sharer')::uuid) then raise exception 'FAIL disabled audience exposed'; end if;
end $$;
reset role;
update public.location_shares set visibility='pickup',visible_to_user_id=current_setting('qa.viewer')::uuid where user_id=current_setting('qa.sharer')::uuid;
set local role authenticated;
do $$ begin
 if not exists(select 1 from public.location_shares where user_id=current_setting('qa.sharer')::uuid) then raise exception 'FAIL designated pickup viewer excluded'; end if;
end $$;
rollback;
select 'PASS: fresh team location visible; stale, expired and disabled team location hidden; designated pickup viewer allowed. All coordinates synthetic and writes rolled back.' as result;
