-- photos is empty, so not null is safe to add
alter table public.photos
  add column if not exists original_filename text not null,
  add column if not exists taken_at timestamp,
  add column if not exists size_bytes bigint;

-- lets `pnpm album add` skip photos that are already uploaded
create unique index if not exists photos_album_filename_key
  on public.photos (album_id, original_filename);
