create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('admin', 'editor');
create type public.festival_status as enum ('draft', 'published', 'archived');
create type public.edition_status as enum ('draft', 'published', 'archived');
create type public.event_status as enum ('scheduled', 'updated', 'cancelled', 'finished');
create type public.review_status as enum ('draft', 'in_review', 'ready', 'published');
create type public.alert_priority as enum ('low', 'medium', 'high', 'critical');
create type public.alert_status as enum ('draft', 'published', 'expired');
create type public.source_kind as enum ('manual', 'csv', 'excel', 'pdf', 'ai');
create type public.audit_action as enum ('insert', 'update', 'delete', 'publish', 'unpublish');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'role', '')::public.app_role;
$$;

create or replace function public.is_internal_user()
returns boolean
language sql
stable
as $$
  select public.current_app_role() in ('admin', 'editor');
$$;

create table public.internal_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.festivals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  city text,
  default_timezone text not null default 'Europe/Madrid',
  status public.festival_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.editions (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  name text not null,
  slug text not null,
  year integer not null check (year between 2000 and 2100),
  starts_on date not null,
  ends_on date not null check (ends_on >= starts_on),
  timezone text not null default 'Europe/Madrid',
  status public.edition_status not null default 'draft',
  is_current boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (festival_id, slug)
);

create unique index editions_one_current_per_festival_idx
  on public.editions (festival_id)
  where is_current;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (festival_id, slug)
);

create table public.festival_groups (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  name text not null,
  slug text not null,
  short_description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (festival_id, slug)
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  name text not null,
  address text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  access_notes text,
  google_maps_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (festival_id, name)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  title text not null,
  slug text not null,
  short_description text,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location_pending boolean not null default false,
  status public.event_status not null default 'scheduled',
  review_status public.review_status not null default 'draft',
  is_featured boolean not null default false,
  change_note text,
  last_change_at timestamptz,
  source_kind public.source_kind not null default 'manual',
  source_reference text,
  source_confidence numeric(4, 3) check (source_confidence between 0 and 1),
  ai_assisted boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.internal_users(id) on delete set null,
  updated_by uuid references public.internal_users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (edition_id, slug),
  check (ends_at is null or ends_at >= starts_at),
  check (location_id is not null or location_pending = true)
);

create table public.event_groups (
  event_id uuid not null references public.events(id) on delete cascade,
  group_id uuid not null references public.festival_groups(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (event_id, group_id)
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  title text not null,
  message text not null,
  priority public.alert_priority not null default 'medium',
  status public.alert_status not null default 'draft',
  visible_from timestamptz,
  visible_until timestamptz,
  published_at timestamptz,
  created_by uuid references public.internal_users(id) on delete set null,
  updated_by uuid references public.internal_users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (visible_until is null or visible_from is null or visible_until >= visible_from)
);

create table public.content_sources (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid references public.editions(id) on delete set null,
  source_kind public.source_kind not null,
  label text not null,
  reference text,
  file_path text,
  notes text,
  ingested_at timestamptz not null default timezone('utc', now()),
  created_by uuid references public.internal_users(id) on delete set null
);

create table public.event_provenance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  source_id uuid not null references public.content_sources(id) on delete cascade,
  field_name text not null,
  source_value text,
  is_ai_generated boolean not null default false,
  validated_by uuid references public.internal_users(id) on delete set null,
  validated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.internal_users(id) on delete set null,
  entity_name text not null,
  entity_id uuid,
  action public.audit_action not null,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index events_public_listing_idx
  on public.events (edition_id, review_status, starts_at);

create index events_category_idx
  on public.events (category_id);

create index alerts_public_listing_idx
  on public.alerts (edition_id, status, visible_from, visible_until);

create index event_groups_group_idx
  on public.event_groups (group_id);

create trigger internal_users_set_updated_at
before update on public.internal_users
for each row execute function public.set_updated_at();

create trigger festivals_set_updated_at
before update on public.festivals
for each row execute function public.set_updated_at();

create trigger editions_set_updated_at
before update on public.editions
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger festival_groups_set_updated_at
before update on public.festival_groups
for each row execute function public.set_updated_at();

create trigger locations_set_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger alerts_set_updated_at
before update on public.alerts
for each row execute function public.set_updated_at();

alter table public.internal_users enable row level security;
alter table public.festivals enable row level security;
alter table public.editions enable row level security;
alter table public.categories enable row level security;
alter table public.festival_groups enable row level security;
alter table public.locations enable row level security;
alter table public.events enable row level security;
alter table public.event_groups enable row level security;
alter table public.alerts enable row level security;
alter table public.content_sources enable row level security;
alter table public.event_provenance enable row level security;
alter table public.audit_logs enable row level security;

create policy "public can read published festivals"
on public.festivals
for select
using (status = 'published');

create policy "public can read published editions"
on public.editions
for select
using (status = 'published');

create policy "public can read active categories"
on public.categories
for select
using (is_active = true);

create policy "public can read active festival groups"
on public.festival_groups
for select
using (is_active = true);

create policy "public can read locations"
on public.locations
for select
using (true);

create policy "public can read published events"
on public.events
for select
using (review_status = 'published');

create policy "public can read published alerts"
on public.alerts
for select
using (
  status = 'published'
  and (visible_from is null or visible_from <= timezone('utc', now()))
  and (visible_until is null or visible_until >= timezone('utc', now()))
);

create policy "internal users can read internal users"
on public.internal_users
for select
using (public.is_internal_user());

create policy "admins can manage internal users"
on public.internal_users
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admins can manage festivals"
on public.festivals
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admins can manage editions"
on public.editions
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "internal users can manage categories"
on public.categories
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "internal users can manage festival groups"
on public.festival_groups
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "internal users can manage locations"
on public.locations
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "internal users can manage events"
on public.events
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "internal users can manage event groups"
on public.event_groups
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "internal users can manage alerts"
on public.alerts
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "internal users can manage content sources"
on public.content_sources
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "internal users can manage event provenance"
on public.event_provenance
for all
using (public.is_internal_user())
with check (public.is_internal_user());

create policy "admins can read audit logs"
on public.audit_logs
for select
using (public.current_app_role() = 'admin');

create policy "internal users can insert audit logs"
on public.audit_logs
for insert
with check (public.is_internal_user());
