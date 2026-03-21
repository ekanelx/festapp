create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_name text not null default 'media',
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  width integer,
  height integer,
  alt_text text,
  created_by uuid references public.internal_users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.media_assets enable row level security;

alter table public.media_assets
  alter column bucket_name set default 'media';

create unique index if not exists media_assets_storage_path_uidx
  on public.media_assets (storage_path);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_assets_width_check'
      and conrelid = 'public.media_assets'::regclass
  ) then
    alter table public.media_assets
      add constraint media_assets_width_check
      check (width is null or width > 0);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_assets_height_check'
      and conrelid = 'public.media_assets'::regclass
  ) then
    alter table public.media_assets
      add constraint media_assets_height_check
      check (height is null or height > 0);
  end if;
end $$;

alter table public.festivals
  add column if not exists cover_media_id uuid references public.media_assets(id) on delete set null;

alter table public.editions
  add column if not exists cover_media_id uuid references public.media_assets(id) on delete set null;

alter table public.events
  add column if not exists cover_media_id uuid references public.media_assets(id) on delete set null;

create index if not exists festivals_cover_media_idx on public.festivals (cover_media_id);
create index if not exists editions_cover_media_idx on public.editions (cover_media_id);
create index if not exists events_cover_media_idx on public.events (cover_media_id);

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'media_assets'
      and policyname = 'public can read media assets'
  ) then
    create policy "public can read media assets"
    on public.media_assets
    for select
    using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'media_assets'
      and policyname = 'internal users can manage media assets'
  ) then
    create policy "internal users can manage media assets"
    on public.media_assets
    for all
    using (public.is_internal_user())
    with check (public.is_internal_user());
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'public can read media files'
  ) then
    create policy "public can read media files"
    on storage.objects
    for select
    using (bucket_id = 'media');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'internal users can upload media files'
  ) then
    create policy "internal users can upload media files"
    on storage.objects
    for insert
    with check (bucket_id = 'media' and public.is_internal_user());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'internal users can update media files'
  ) then
    create policy "internal users can update media files"
    on storage.objects
    for update
    using (bucket_id = 'media' and public.is_internal_user())
    with check (bucket_id = 'media' and public.is_internal_user());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'internal users can delete media files'
  ) then
    create policy "internal users can delete media files"
    on storage.objects
    for delete
    using (bucket_id = 'media' and public.is_internal_user());
  end if;
end $$;
