-- Seed tecnico e idempotente para validar UX publica y CMS base con datos realistas.
-- Crea un festival, una edicion activa y un conjunto de actos publicados repartidos
-- en varios dias, con ubicaciones mixtas y estados visibles para el usuario final.

insert into public.festivals (name, slug, city, status)
values ('Moros y Cristianos', 'moros-y-cristianos', 'Alcoy', 'published')
on conflict (slug) do update
set
  name = excluded.name,
  city = excluded.city,
  status = excluded.status;

with selected_festival as (
  select id
  from public.festivals
  where slug = 'moros-y-cristianos'
)
insert into public.editions (
  festival_id,
  name,
  slug,
  year,
  starts_on,
  ends_on,
  status,
  is_current
)
select
  id,
  concat('Edicion ', extract(year from current_date)::int),
  extract(year from current_date)::int::text,
  extract(year from current_date)::int,
  current_date,
  current_date + 4,
  'published',
  true
from selected_festival
on conflict (festival_id, slug) do update
set
  name = excluded.name,
  year = excluded.year,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  status = excluded.status,
  is_current = excluded.is_current;

with selected_festival as (
  select id
  from public.festivals
  where slug = 'moros-y-cristianos'
),
seed_locations(name, address) as (
  values
    ('Plaza de Espana', 'Plaza de Espana, Alcoy'),
    ('Avenida Pais Valencia', 'Avenida Pais Valencia, Alcoy'),
    ('Teatro Calderon', 'Plaza de Espana, 14, Alcoy'),
    ('Castillo de Fiestas', 'Plaza Pintor Gisbert, Alcoy'),
    ('Parterre', 'Passeig de Cervantes, Alcoy')
)
insert into public.locations (festival_id, name, address)
select
  selected_festival.id,
  seed_locations.name,
  seed_locations.address
from selected_festival
cross join seed_locations
on conflict (festival_id, name) do update
set
  address = excluded.address;

with selected_festival as (
  select id
  from public.festivals
  where slug = 'moros-y-cristianos'
),
selected_edition as (
  select id
  from public.editions
  where festival_id = (select id from selected_festival)
    and slug = extract(year from current_date)::int::text
),
event_seed(slug, title, short_description, change_note, day_offset, start_time, location_name, status) as (
  values
    ('despertar-festero', 'Despertar festero', 'Inicio temprano de la jornada festera con recorrido breve.', null, 0, time '08:00', 'Parterre', 'scheduled'::public.event_status),
    ('reparto-de-programas', 'Reparto de programas', 'Punto de recogida del programa oficial y avisos del dia.', null, 0, time '10:30', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('apertura-del-mercado-medieval', 'Apertura del mercado medieval', 'Apertura del mercado con animacion y puestos durante toda la manana.', 'Horario actualizado por coordinacion del montaje.', 0, time '12:00', 'Avenida Pais Valencia', 'updated'::public.event_status),
    ('concierto-de-bandas', 'Concierto de bandas', 'Actuacion conjunta de bandas participantes en la edicion actual.', null, 0, time '19:30', 'Teatro Calderon', 'scheduled'::public.event_status),
    ('entrada-de-bandas', 'Entrada de bandas', 'Desfile musical previo a los actos centrales de la noche.', null, 0, time '22:00', null, 'scheduled'::public.event_status),
    ('diana-mora', 'Diana mora', 'Recorrido matinal de comparsas con salida temprana.', null, 1, time '07:30', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('misa-mayor', 'Misa mayor', 'Celebracion principal de la jornada con acceso por orden de llegada.', null, 1, time '11:00', 'Teatro Calderon', 'scheduled'::public.event_status),
    ('mascleta-de-mediodia', 'Mascleta de mediodia', 'Acto pirotecnico previsto para primera hora de la tarde.', 'Acto cancelado por condiciones de seguridad.', 1, time '14:00', 'Parterre', 'cancelled'::public.event_status),
    ('entrada-cristiana', 'Entrada cristiana', 'Desfile principal de la tarde con paso por el eje central.', null, 1, time '18:30', 'Avenida Pais Valencia', 'scheduled'::public.event_status),
    ('verbenas-en-la-glorieta', 'Verbenas en la glorieta', 'Sesion nocturna abierta con musica en directo.', null, 1, time '23:45', null, 'scheduled'::public.event_status),
    ('almuerzo-de-filaes', 'Almuerzo de filaes', 'Encuentro informal de filaes antes de los actos de tarde.', null, 2, time '09:30', null, 'scheduled'::public.event_status),
    ('embajada-mora', 'Embajada mora', 'Representacion central de la jornada en el castillo festero.', 'Se retrasa media hora respecto al horario inicial.', 2, time '17:30', 'Castillo de Fiestas', 'updated'::public.event_status),
    ('retreta-infantil', 'Retreta infantil', 'Desfile infantil con recorrido adaptado para familias.', null, 2, time '20:00', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('ofrenda-floral', 'Ofrenda floral', 'Ofrenda colectiva con concentracion previa en el centro.', null, 3, time '10:00', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('procesion-general', 'Procesion general', 'Recorrido procesional por el tramo principal del festival.', null, 3, time '19:00', 'Avenida Pais Valencia', 'scheduled'::public.event_status),
    ('castillo-de-fuegos', 'Castillo de fuegos', 'Cierre final de la edicion con espectaculo pirotecnico.', null, 4, time '23:00', 'Parterre', 'scheduled'::public.event_status)
),
selected_locations as (
  select id, name
  from public.locations
  where festival_id = (select id from selected_festival)
)
insert into public.events (
  edition_id,
  title,
  slug,
  short_description,
  starts_at,
  location_id,
  location_pending,
  review_status,
  status,
  change_note
)
select
  selected_edition.id,
  event_seed.title,
  event_seed.slug,
  event_seed.short_description,
  ((current_date + event_seed.day_offset)::timestamp + event_seed.start_time) at time zone 'Europe/Madrid',
  selected_locations.id,
  event_seed.location_name is null,
  'published'::public.review_status,
  event_seed.status,
  event_seed.change_note
from selected_edition
cross join event_seed
left join selected_locations on selected_locations.name = event_seed.location_name
on conflict (edition_id, slug) do update
set
  title = excluded.title,
  short_description = excluded.short_description,
  starts_at = excluded.starts_at,
  location_id = excluded.location_id,
  location_pending = excluded.location_pending,
  review_status = excluded.review_status,
  status = excluded.status,
  change_note = excluded.change_note;
