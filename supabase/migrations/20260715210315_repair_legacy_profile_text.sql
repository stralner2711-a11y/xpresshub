begin;

-- Repair the one legacy owner title that was saved after a double UTF-8 decode.
-- The predicate is deliberately exact so legitimate custom job titles are untouched.
update public.profiles
set
  role = 'Appansvarlig · Lastbilchauffør',
  updated_at = now()
where lower(coalesce(access_role, '')) = 'owner'
  and role = 'Appansvarlig ' || chr(194) || chr(183) || ' Lastbilchauff' || chr(195) || chr(184) || 'r';

commit;
