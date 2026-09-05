-- Transaction-only fixtures: no mail is sent and all changes are rolled back.
begin;
insert into auth.users (id, email, raw_user_meta_data)
values
 ('672e93a0-6cc1-4d14-9ab1-bc875ef19001', 'qa-approval-request@example.invalid', '{"full_name":"QA Approval Request","access_role":"owner","employment_status":"active","first_personal_password":true}'),
 ('672e93a0-6cc1-4d14-9ab1-bc875ef19002', 'qa-approval-admin@example.invalid', '{"full_name":"QA Approval Admin"}');
do $$ begin
 if not exists (select 1 from public.profiles where id='672e93a0-6cc1-4d14-9ab1-bc875ef19001' and employment_status='paused' and access_role='employee' and full_name='QA Approval Request') then
  raise exception 'Signup did not create a pending employee or trusted privilege metadata';
 end if;
end $$;
update public.profiles set access_role='admin', employment_status='active' where id='672e93a0-6cc1-4d14-9ab1-bc875ef19002';
set local role authenticated;
select set_config('request.jwt.claim.sub','672e93a0-6cc1-4d14-9ab1-bc875ef19001',true);
select set_config('request.jwt.claims','{"sub":"672e93a0-6cc1-4d14-9ab1-bc875ef19001","role":"authenticated"}',true);
do $$ declare affected integer; begin
 if (select count(*) from public.profiles) <> 1 then raise exception 'Pending user can see colleagues'; end if;
 if exists(select 1 from public.messages) or exists(select 1 from public.conversations) or exists(select 1 from public.location_shares) or exists(select 1 from public.admin_audit_log) or exists(select 1 from public.employee_invitations) then raise exception 'Pending user can read protected data'; end if;
 update public.profiles set employment_status='active',access_role='owner' where id=auth.uid();
 get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Pending user can approve themself'; end if;
end $$;
select set_config('request.jwt.claim.sub','672e93a0-6cc1-4d14-9ab1-bc875ef19002',true);
select set_config('request.jwt.claims','{"sub":"672e93a0-6cc1-4d14-9ab1-bc875ef19002","role":"authenticated"}',true);
do $$ declare affected integer; begin
 update public.profiles set employment_status='active' where id='672e93a0-6cc1-4d14-9ab1-bc875ef19001';
 get diagnostics affected=row_count;
 if affected<>1 then raise exception 'Admin cannot approve request'; end if;
end $$;
select set_config('request.jwt.claim.sub','672e93a0-6cc1-4d14-9ab1-bc875ef19001',true);
select set_config('request.jwt.claims','{"sub":"672e93a0-6cc1-4d14-9ab1-bc875ef19001","role":"authenticated"}',true);
do $$ begin
 if not private.is_active_employee() then raise exception 'Approved user remains blocked'; end if;
 if private.is_admin() then raise exception 'Approval granted admin rights'; end if;
end $$;
select set_config('request.jwt.claim.sub','672e93a0-6cc1-4d14-9ab1-bc875ef19002',true);
select set_config('request.jwt.claims','{"sub":"672e93a0-6cc1-4d14-9ab1-bc875ef19002","role":"authenticated"}',true);
update public.profiles set employment_status='offboarded' where id='672e93a0-6cc1-4d14-9ab1-bc875ef19001';
select set_config('request.jwt.claim.sub','672e93a0-6cc1-4d14-9ab1-bc875ef19001',true);
select set_config('request.jwt.claims','{"sub":"672e93a0-6cc1-4d14-9ab1-bc875ef19001","role":"authenticated"}',true);
do $$ begin
 if private.is_active_employee() then raise exception 'Rejected user remains active'; end if;
 if exists(select 1 from public.messages) or exists(select 1 from public.conversations) then raise exception 'Rejected user can read chats'; end if;
end $$;
rollback;
