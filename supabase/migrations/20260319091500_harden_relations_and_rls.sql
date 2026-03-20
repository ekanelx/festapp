create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select iu.role
  from public.internal_users iu
  where iu.id = auth.uid()
    and iu.is_active = true
  limit 1;
$$;

create or replace function public.is_internal_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.internal_users iu
    where iu.id = auth.uid()
      and iu.is_active = true
  );
$$;

create or replace function public.validate_event_catalog_festival_consistency()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  event_festival_id uuid;
  category_festival_id uuid;
  location_festival_id uuid;
begin
  select e.festival_id
  into event_festival_id
  from public.editions e
  where e.id = new.edition_id;

  if new.category_id is not null then
    select c.festival_id
    into category_festival_id
    from public.categories c
    where c.id = new.category_id;

    if category_festival_id is distinct from event_festival_id then
      raise exception
        using
          errcode = '23514',
          message = 'Event category must belong to the same festival as the edition.';
    end if;
  end if;

  if new.location_id is not null then
    select l.festival_id
    into location_festival_id
    from public.locations l
    where l.id = new.location_id;

    if location_festival_id is distinct from event_festival_id then
      raise exception
        using
          errcode = '23514',
          message = 'Event location must belong to the same festival as the edition.';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.validate_event_group_festival_consistency()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  event_festival_id uuid;
  group_festival_id uuid;
begin
  select ed.festival_id
  into event_festival_id
  from public.events ev
  join public.editions ed on ed.id = ev.edition_id
  where ev.id = new.event_id;

  select fg.festival_id
  into group_festival_id
  from public.festival_groups fg
  where fg.id = new.group_id;

  if group_festival_id is distinct from event_festival_id then
    raise exception
      using
        errcode = '23514',
        message = 'Event group must belong to the same festival as the event.';
  end if;

  return new;
end;
$$;

create or replace function public.validate_alert_event_edition_consistency()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  event_edition_id uuid;
begin
  if new.event_id is null then
    return new;
  end if;

  select ev.edition_id
  into event_edition_id
  from public.events ev
  where ev.id = new.event_id;

  if event_edition_id is distinct from new.edition_id then
    raise exception
      using
        errcode = '23514',
        message = 'Alert event must belong to the same edition as the alert.';
  end if;

  return new;
end;
$$;

do $$
begin
  if exists (
    select 1
    from public.events ev
    join public.editions ed on ed.id = ev.edition_id
    left join public.categories c on c.id = ev.category_id
    left join public.locations l on l.id = ev.location_id
    where (c.id is not null and c.festival_id <> ed.festival_id)
       or (l.id is not null and l.festival_id <> ed.festival_id)
  ) then
    raise exception
      using
        errcode = '23514',
        message = 'Cannot harden schema: existing events reference categories or locations from another festival.';
  end if;

  if exists (
    select 1
    from public.event_groups eg
    join public.events ev on ev.id = eg.event_id
    join public.editions ed on ed.id = ev.edition_id
    join public.festival_groups fg on fg.id = eg.group_id
    where fg.festival_id <> ed.festival_id
  ) then
    raise exception
      using
        errcode = '23514',
        message = 'Cannot harden schema: existing event groups reference another festival.';
  end if;

  if exists (
    select 1
    from public.alerts al
    join public.events ev on ev.id = al.event_id
    where al.event_id is not null
      and ev.edition_id <> al.edition_id
  ) then
    raise exception
      using
        errcode = '23514',
        message = 'Cannot harden schema: existing alerts reference events from another edition.';
  end if;
end;
$$;

drop trigger if exists validate_event_catalog_festival_consistency on public.events;
create trigger validate_event_catalog_festival_consistency
before insert or update of edition_id, category_id, location_id
on public.events
for each row
execute function public.validate_event_catalog_festival_consistency();

drop trigger if exists validate_event_group_festival_consistency on public.event_groups;
create trigger validate_event_group_festival_consistency
before insert or update of event_id, group_id
on public.event_groups
for each row
execute function public.validate_event_group_festival_consistency();

drop trigger if exists validate_alert_event_edition_consistency on public.alerts;
create trigger validate_alert_event_edition_consistency
before insert or update of edition_id, event_id
on public.alerts
for each row
execute function public.validate_alert_event_edition_consistency();

drop policy if exists "public can read published editions" on public.editions;
create policy "public can read published editions"
on public.editions
for select
using (
  status = 'published'
  and exists (
    select 1
    from public.festivals f
    where f.id = festival_id
      and f.status = 'published'
  )
);

drop policy if exists "public can read active categories" on public.categories;
create policy "public can read active categories"
on public.categories
for select
using (
  is_active = true
  and exists (
    select 1
    from public.festivals f
    where f.id = festival_id
      and f.status = 'published'
  )
);

drop policy if exists "public can read active festival groups" on public.festival_groups;
create policy "public can read active festival groups"
on public.festival_groups
for select
using (
  is_active = true
  and exists (
    select 1
    from public.festivals f
    where f.id = festival_id
      and f.status = 'published'
  )
);

drop policy if exists "public can read locations" on public.locations;
create policy "public can read locations"
on public.locations
for select
using (
  exists (
    select 1
    from public.festivals f
    where f.id = festival_id
      and f.status = 'published'
  )
);

drop policy if exists "public can read published events" on public.events;
create policy "public can read published events"
on public.events
for select
using (
  review_status = 'published'
  and exists (
    select 1
    from public.editions ed
    join public.festivals f on f.id = ed.festival_id
    where ed.id = edition_id
      and ed.status = 'published'
      and f.status = 'published'
  )
);

drop policy if exists "public can read published alerts" on public.alerts;
create policy "public can read published alerts"
on public.alerts
for select
using (
  status = 'published'
  and (visible_from is null or visible_from <= timezone('utc', now()))
  and (visible_until is null or visible_until >= timezone('utc', now()))
  and exists (
    select 1
    from public.editions ed
    join public.festivals f on f.id = ed.festival_id
    where ed.id = edition_id
      and ed.status = 'published'
      and f.status = 'published'
  )
);
