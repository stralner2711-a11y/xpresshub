begin;
do $$
declare employee uuid; owner_user uuid; own_chat uuid := gen_random_uuid(); hidden_chat uuid := gen_random_uuid();
begin
  select id into employee from public.profiles where access_role='employee' and employment_status='active' limit 1;
  select id into owner_user from public.profiles where access_role='owner' and employment_status='active' limit 1;
  if employee is null or owner_user is null then raise exception 'Missing test roles'; end if;
  perform set_config('qa.employee',employee::text,true);
  perform set_config('qa.owner',owner_user::text,true);
  perform set_config('qa.own_chat',own_chat::text,true);
  perform set_config('qa.hidden_chat',hidden_chat::text,true);
  insert into public.conversations(id,title,channel_type) values(own_chat,'QA rollback only','direct'),(hidden_chat,'QA rollback only','direct');
  insert into public.conversation_members(conversation_id,user_id) values(own_chat,employee),(hidden_chat,owner_user);
  insert into public.messages(conversation_id,sender_id,body) values(hidden_chat,owner_user,'QA synthetic private message');
  insert into public.private_log_entries(user_id,place,note) values(owner_user,'QA synthetic place','QA rollback only');
  perform set_config('request.jwt.claim.sub',employee::text,true);
  perform set_config('request.jwt.claim.role','authenticated',true);
end $$;
set local role authenticated;
do $$
declare denied boolean; affected integer;
begin
  begin
    update public.profiles set access_role='owner' where id=auth.uid();
  exception when raise_exception then
    if sqlerrm <> 'owner_role_change_requires_owner' then raise; end if;
  end;
  if exists(select 1 from public.profiles where id=auth.uid() and access_role <> 'employee') then raise exception 'FAIL self promotion'; end if;
  if exists(select 1 from public.messages where conversation_id=current_setting('qa.hidden_chat')::uuid) then raise exception 'FAIL private message disclosure'; end if;
  if exists(select 1 from public.private_log_entries where user_id=current_setting('qa.owner')::uuid) then raise exception 'FAIL private log disclosure'; end if;
  if exists(select 1 from public.employee_invitations) then raise exception 'FAIL employee invitation disclosure'; end if;
  if exists(select 1 from public.admin_audit_log) then raise exception 'FAIL admin audit disclosure'; end if;
  denied := false;
  begin
    insert into public.messages(conversation_id,sender_id,body) values(current_setting('qa.hidden_chat')::uuid,auth.uid(),'QA unauthorized');
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'FAIL unauthorized message send'; end if;
  denied := false;
  begin
    insert into public.messages(conversation_id,sender_id,body) values(current_setting('qa.own_chat')::uuid,current_setting('qa.owner')::uuid,'QA forged sender');
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'FAIL forged sender'; end if;
  insert into public.messages(conversation_id,sender_id,body) values(current_setting('qa.own_chat')::uuid,auth.uid(),'QA allowed');
  if not exists(select 1 from public.messages where conversation_id=current_setting('qa.own_chat')::uuid and body='QA allowed') then raise exception 'FAIL own message unreadable'; end if;
  delete from public.messages where conversation_id=current_setting('qa.hidden_chat')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'FAIL deleted another message'; end if;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claim.sub','',true); perform set_config('request.jwt.claim.role','anon',true); end $$;
set local role anon;
do $$
declare denied boolean := false;
begin
  begin
    insert into public.messages(conversation_id,sender_id,body) values(current_setting('qa.own_chat')::uuid,current_setting('qa.employee')::uuid,'QA anonymous');
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'FAIL anonymous message'; end if;
end $$;
rollback;
select 'PASS: employee role protected; private messages, logs, invitations and audit hidden; unauthorized and forged messages blocked; own message allowed; other message deletion blocked; anonymous insert blocked. All writes rolled back.' as result;
