-- Seed tecnico e idempotente para validar la home global y el vertical publico.
-- Crea dos festivales publicados con ediciones cercanas en el tiempo:
-- una en curso y otra proxima, ambas con actos reales suficientes para validar navegacion.

insert into public.festivals (name, slug, city, status)
values
  ('Moros y Cristianos', 'moros-y-cristianos', 'Alcoy', 'published'),
  ('Feria de Primavera', 'feria-de-primavera', 'Ontinyent', 'published')
on conflict (slug) do update
set
  name = excluded.name,
  city = excluded.city,
  status = excluded.status;

with festival_seed(festival_slug, edition_name, edition_slug, year, starts_on, ends_on, is_current) as (
  values
    (
      'moros-y-cristianos',
      concat('Edicion ', extract(year from current_date)::int),
      extract(year from current_date)::int::text,
      extract(year from current_date)::int,
      current_date,
      current_date + 4,
      true
    ),
    (
      'feria-de-primavera',
      concat('Edicion ', extract(year from current_date)::int),
      extract(year from current_date)::int::text,
      extract(year from current_date)::int,
      current_date + 6,
      current_date + 8,
      false
    )
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
  festivals.id,
  festival_seed.edition_name,
  festival_seed.edition_slug,
  festival_seed.year,
  festival_seed.starts_on,
  festival_seed.ends_on,
  'published',
  festival_seed.is_current
from festival_seed
join public.festivals on festivals.slug = festival_seed.festival_slug
on conflict (festival_id, slug) do update
set
  name = excluded.name,
  year = excluded.year,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  status = excluded.status,
  is_current = excluded.is_current;

with location_seed(festival_slug, name, address) as (
  values
    ('moros-y-cristianos', 'Plaza de Espana', 'Plaza de Espana, Alcoy'),
    ('moros-y-cristianos', 'Avenida Pais Valencia', 'Avenida Pais Valencia, Alcoy'),
    ('moros-y-cristianos', 'Teatro Calderon', 'Plaza de Espana, 14, Alcoy'),
    ('moros-y-cristianos', 'Castillo de Fiestas', 'Plaza Pintor Gisbert, Alcoy'),
    ('moros-y-cristianos', 'Parterre', 'Passeig de Cervantes, Alcoy'),
    ('feria-de-primavera', 'Recinto Ferial', 'Avenida Daniel Gil, Ontinyent'),
    ('feria-de-primavera', 'Placa Major', 'Placa Major, Ontinyent'),
    ('feria-de-primavera', 'Parque de la Glorieta', 'Carrer Dos de Maig, Ontinyent')
)
insert into public.locations (festival_id, name, address)
select
  festivals.id,
  location_seed.name,
  location_seed.address
from location_seed
join public.festivals on festivals.slug = location_seed.festival_slug
on conflict (festival_id, name) do update
set
  address = excluded.address;

with event_seed(
  festival_slug,
  edition_slug,
  slug,
  title,
  short_description,
  change_note,
  day_offset,
  start_time,
  location_name,
  status
) as (
  values
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'despertar-festero', 'Despertar festero', 'Inicio temprano de la jornada festera con recorrido breve.', null, 0, time '08:00', 'Parterre', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'reparto-de-programas', 'Reparto de programas', 'Punto de recogida del programa oficial y avisos del dia.', null, 0, time '10:30', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'apertura-del-mercado-medieval', 'Apertura del mercado medieval', 'Apertura del mercado con animacion y puestos durante toda la manana.', 'Horario actualizado por coordinacion del montaje.', 0, time '12:00', 'Avenida Pais Valencia', 'updated'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'concierto-de-bandas', 'Concierto de bandas', 'Actuacion conjunta de bandas participantes en la edicion actual.', null, 0, time '19:30', 'Teatro Calderon', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'entrada-de-bandas', 'Entrada de bandas', 'Desfile musical previo a los actos centrales de la noche.', null, 0, time '22:00', null, 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'diana-mora', 'Diana mora', 'Recorrido matinal de comparsas con salida temprana.', null, 1, time '07:30', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'misa-mayor', 'Misa mayor', 'Celebracion principal de la jornada con acceso por orden de llegada.', null, 1, time '11:00', 'Teatro Calderon', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'mascleta-de-mediodia', 'Mascleta de mediodia', 'Acto pirotecnico previsto para primera hora de la tarde.', 'Acto cancelado por condiciones de seguridad.', 1, time '14:00', 'Parterre', 'cancelled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'entrada-cristiana', 'Entrada cristiana', 'Desfile principal de la tarde con paso por el eje central.', null, 1, time '18:30', 'Avenida Pais Valencia', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'verbenas-en-la-glorieta', 'Verbenas en la glorieta', 'Sesion nocturna abierta con musica en directo.', null, 1, time '23:45', null, 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'almuerzo-de-filaes', 'Almuerzo de filaes', 'Encuentro informal de filaes antes de los actos de tarde.', null, 2, time '09:30', null, 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'embajada-mora', 'Embajada mora', 'Representacion central de la jornada en el castillo festero.', 'Se retrasa media hora respecto al horario inicial.', 2, time '17:30', 'Castillo de Fiestas', 'updated'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'retreta-infantil', 'Retreta infantil', 'Desfile infantil con recorrido adaptado para familias.', null, 2, time '20:00', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'ofrenda-floral', 'Ofrenda floral', 'Ofrenda colectiva con concentracion previa en el centro.', null, 3, time '10:00', 'Plaza de Espana', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'procesion-general', 'Procesion general', 'Recorrido procesional por el tramo principal del festival.', null, 3, time '19:00', 'Avenida Pais Valencia', 'scheduled'::public.event_status),
    ('moros-y-cristianos', extract(year from current_date)::int::text, 'castillo-de-fuegos', 'Castillo de fuegos', 'Cierre final de la edicion con espectaculo pirotecnico.', null, 4, time '23:00', 'Parterre', 'scheduled'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'apertura-de-casetas', 'Apertura de casetas', 'Inicio de la feria con apertura de puestos y zona gastronomica.', null, 6, time '18:00', 'Recinto Ferial', 'scheduled'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'pasacalle-inaugural', 'Pasacalle inaugural', 'Recorrido musical de bienvenida por el centro.', null, 6, time '20:00', 'Placa Major', 'scheduled'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'concierto-pop-nocturno', 'Concierto pop nocturno', 'Actuacion principal de la noche en el recinto ferial.', null, 6, time '22:30', 'Recinto Ferial', 'scheduled'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'muestra-artesana', 'Muestra artesana', 'Expositores locales y talleres abiertos durante la tarde.', null, 7, time '11:00', 'Parque de la Glorieta', 'scheduled'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'tardeo-de-charangas', 'Tardeo de charangas', 'Ambiente de tarde con musica itinerante por la feria.', 'Pasa a empezar media hora mas tarde.', 7, time '18:30', 'Placa Major', 'updated'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'sesion-dj-de-feria', 'Sesion DJ de feria', 'Cierre nocturno con musica en directo y acceso libre.', null, 7, time '23:30', 'Recinto Ferial', 'scheduled'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'mercado-de-domingo', 'Mercado de domingo', 'Puestos abiertos de manana con producto local.', null, 8, time '10:00', 'Recinto Ferial', 'scheduled'::public.event_status),
    ('feria-de-primavera', extract(year from current_date)::int::text, 'cierre-infantil', 'Cierre infantil', 'Actividades familiares para cerrar la edicion.', null, 8, time '18:00', null, 'scheduled'::public.event_status)
),
selected_editions as (
  select editions.id, editions.slug, festivals.slug as festival_slug
  from public.editions
  join public.festivals on festivals.id = editions.festival_id
),
selected_locations as (
  select locations.id, locations.name, festivals.slug as festival_slug
  from public.locations
  join public.festivals on festivals.id = locations.festival_id
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
  selected_editions.id,
  event_seed.title,
  event_seed.slug,
  event_seed.short_description,
  ((current_date + event_seed.day_offset)::timestamp + event_seed.start_time) at time zone 'Europe/Madrid',
  selected_locations.id,
  event_seed.location_name is null,
  'published'::public.review_status,
  event_seed.status,
  event_seed.change_note
from event_seed
join selected_editions
  on selected_editions.festival_slug = event_seed.festival_slug
 and selected_editions.slug = event_seed.edition_slug
left join selected_locations
  on selected_locations.festival_slug = event_seed.festival_slug
 and selected_locations.name = event_seed.location_name
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
