-- Transaction-only regression: no uploaded files or persistent rows are created.
begin;
do $$
declare test_user uuid;
begin
  select id into test_user from public.profiles
  where employment_status = 'active' order by created_at limit 1;
  if test_user is null then raise exception 'No active profile available for RLS test'; end if;
  perform set_config('request.jwt.claim.sub', test_user::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
end $$;
set local role authenticated;
do $$
declare blocked boolean := false; row_id uuid; marker text := 'qa-owner-path-' || gen_random_uuid()::text;
begin
  begin
    insert into public.media_attachments(owner_id,bucket,storage_path,file_name,mime_type,size_bytes,visibility)
    values(auth.uid(),'xpressintra-media',gen_random_uuid()::text || '/' || marker,marker,'image/png',1,'profile');
  exception when check_violation then blocked := true;
  end;
  if not blocked then raise exception 'FAIL: foreign folder accepted'; end if;
  blocked := false;
  begin
    insert into public.media_attachments(owner_id,bucket,storage_path,file_name,mime_type,size_bytes,visibility)
    values(auth.uid(),'another-bucket',auth.uid()::text || '/' || marker,marker,'image/png',1,'profile');
  exception when check_violation then blocked := true;
  end;
  if not blocked then raise exception 'FAIL: foreign bucket accepted'; end if;
  insert into public.media_attachments(owner_id,bucket,storage_path,file_name,mime_type,size_bytes,visibility)
  values(auth.uid(),'xpressintra-media',auth.uid()::text || '/' || marker,marker,'image/png',1,'profile')
  returning id into row_id;
  if not exists(select 1 from public.media_attachments where id=row_id) then
    raise exception 'FAIL: own metadata not readable';
  end if;
end $$;
rollback;
select 'PASS: foreign path and bucket denied, own metadata allowed; all test writes rolled back' as result;
