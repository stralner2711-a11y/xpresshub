-- Bind media metadata to the same user folder enforced by Storage INSERT RLS.
-- This also protects UPDATE if a future policy enables metadata editing.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.media_attachments'::regclass
      and conname = 'media_attachments_owner_path_check'
  ) then
    alter table public.media_attachments
      add constraint media_attachments_owner_path_check
      check (
        bucket = 'xpressintra-media'
        and split_part(storage_path, '/', 1) = owner_id::text
        and length(storage_path) > length(owner_id::text) + 1
      );
  end if;
end $$;
