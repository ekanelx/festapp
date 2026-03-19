# Festapp v1 - Fundacion tecnica fase 0

## 1. Lectura rapida

Festapp debe arrancar como una web app mobile-first pensada para resolver una pregunta operativa en segundos: que acto hay, cuando, donde y si ha cambiado. La base tecnica correcta para esa necesidad no es una arquitectura compleja, sino un nucleo claro con App Router, un dominio relacional fuerte y una separacion limpia entre catalogo publico y CMS interno.

En esta fase la decision es preparar el sistema para construir primero el catalogo publico y despues el CMS basico. Eso implica modelar bien `festival > edition > event`, dejar alertas y catalogos reutilizables desde el principio, y posponer push, IA e importaciones avanzadas a fases posteriores sin bloquearlas tecnicamente.

## 2. Arquitectura propuesta

### Frontend

- Next.js App Router como capa principal de UI.
- Rutas publicas server-first para home de edicion, agenda, alertas, historico y detalle.
- Componentes cliente solo donde aporten valor real despues: favoritos locales, compartir nativo, filtros interactivos.
- Estado de busqueda y filtros en URL para que la agenda sea rapida, compartible y cacheable.

### Backend y datos

- Supabase como backend principal de v1 para Postgres, auth interna y futuras policies.
- Modelo relacional explicito para entidades core; nada de blobs JSON en el nucleo funcional.
- RLS preparada desde el esquema para separar lectura publica y escritura interna.
- Trazabilidad minima con `created_by`, `updated_by`, `source_kind`, `event_provenance` y `audit_logs`.

### Limites de esta fase

- No se implementa login real.
- No se implementa CRUD real.
- No se conectan aun las rutas a Supabase.
- No se implementan push, importacion ni IA.

## 3. Entidades y relaciones principales

### Core

- `festivals`
  - raiz funcional del producto multi-fiesta
  - tiene muchas `editions`, `categories`, `festival_groups` y `locations`

- `editions`
  - pertenece a una `festival`
  - segmenta completamente el contenido publico
  - tiene muchos `events` y `alerts`

- `events`
  - pertenece a una `edition`
  - tiene una `category` opcional y una `location` opcional con bandera `location_pending`
  - usa dos ejes de estado:
    - operativo: `scheduled`, `updated`, `cancelled`, `finished`
    - editorial: `draft`, `in_review`, `ready`, `published`

- `alerts`
  - pertenecen a una `edition`
  - pueden apuntar opcionalmente a un `event`
  - tienen prioridad y vigencia

### Catalogos reutilizables

- `categories`
  - catalogo simple por fiesta

- `festival_groups`
  - resuelve comparsas o filàs
  - se relaciona con `events` via `event_groups`
  - se modela como muchos-a-muchos para no forzar un solo grupo por acto

- `locations`
  - catalogo reutilizable por fiesta
  - permite nombre, direccion, coordenadas y notas de acceso

### Operacion interna

- `internal_users`
  - referencia usuarios de Supabase Auth
  - roles simples: `admin`, `editor`

- `content_sources`
  - base para futuras importaciones manuales, CSV, Excel, PDF o IA

- `event_provenance`
  - deja trazabilidad por campo cuando el origen del dato importa

- `audit_logs`
  - bitacora generica para cambios relevantes en CMS

## 4. Rutas minimas

### Publicas

- `/`
  - landing tecnica del scaffold y punto de entrada mientras no exista home real de seleccion

- `/:festivalSlug/:editionSlug`
  - home publica de una edicion

- `/:festivalSlug/:editionSlug/agenda`
  - agenda completa con espacio para busqueda y filtros

- `/:festivalSlug/:editionSlug/alertas`
  - listado de alertas vigentes

- `/:festivalSlug/:editionSlug/historico`
  - actos finalizados de la edicion

- `/:festivalSlug/:editionSlug/actos/:eventSlug`
  - ficha de acto

### Privadas

- `/cms`
  - resumen operativo del backoffice

- `/cms/actos`
  - CRUD de actos en siguientes fases

- `/cms/alertas`
  - CRUD de alertas en siguientes fases

- `/cms/catalogo`
  - gestion de fiestas, ediciones, ubicaciones, categorias y comparsas o filàs segun rol

## 5. Estructura de carpetas

```text
app/
  (public)/
    page.tsx
    [festivalSlug]/
      [editionSlug]/
        page.tsx
        agenda/page.tsx
        alertas/page.tsx
        historico/page.tsx
        actos/[eventSlug]/page.tsx
  (cms)/
    cms/
      layout.tsx
      page.tsx
      actos/page.tsx
      alertas/page.tsx
      catalogo/page.tsx
components/
  cms/
  layout/
  public/
  shared/
lib/
  config/
  data/
  domain/
  supabase/
supabase/
  migrations/
docs/
  architecture/
  implementation/
```

## 6. Riesgos y ambiguedades reales

1. Comparsa o filà puede no ser una relacion uno-a-uno con acto.
   - Decision: se prepara `event_groups` como muchos-a-muchos.

2. La edicion activa no esta completamente cerrada en la PRD.
   - Decision: `editions` incluye `is_current` para soportar seleccion manual inicial desde CMS.

3. Favoritos en v1 son locales, no de servidor.
   - Decision: no se modelan en base de datos en esta fase para no meter complejidad innecesaria.

4. El contenido publico no debe mezclar borradores.
   - Decision: se separan claramente estado operativo y estado editorial.

5. Push, importacion e IA aparecen en la PRD, pero no deben contaminar el nucleo inicial.
   - Decision: se dejan puntos de extension ligeros (`content_sources`, `event_provenance`) sin construir aun los flujos completos.

## 7. Lo que NO entra todavia

- autenticacion real de CMS
- middleware de proteccion con sesion operativa
- formularios y acciones de escritura
- listados conectados a Supabase
- busqueda real y filtros funcionales
- favoritos persistidos
- compartir nativo
- Google Maps real a partir de coordenadas
- importacion CSV, Excel o PDF
- push notifications
- asistencia IA

## 8. Validacion de esta fase

Esta fase queda bien resuelta si:

- el repo ya arranca como proyecto Next.js
- la estructura del producto esta representada en rutas y carpetas
- el esquema SQL ya refleja entidades, relaciones y estados principales
- el sistema separa claramente publico y CMS
- el plan posterior puede ejecutarse sin rehacer la base

