# Festapp v1 - Cierre operativo de Fase 1.5

## Objetivo de este documento

Dejar la conexion real de GitHub + Supabase + auth CMS en un estado:

- reproducible
- auditable
- sin dependencia de mocks
- sin depender de pasos manuales opacos

Este documento cubre solo la base real ya conectada en Fase 1.5. No abre nuevas features.

## Estado validado de verdad

Queda validado en un proyecto Supabase real ya enlazado que:

- las migraciones del repo aplican correctamente
- el schema remoto contiene las tablas y funciones base del CMS
- el login del CMS funciona con Supabase Auth
- `/cms` queda protegido
- `admin` entra y puede abrir `/cms/catalogo`
- `editor` entra pero no puede abrir `/cms/catalogo`
- `inactive` autentica en Auth pero no obtiene acceso interno
- las consultas minimas reales del CMS leen `festivals`, `editions` y `events`

## Migraciones aplicadas y verificadas

Migraciones presentes en el repo y verificadas en remoto con `npx supabase migration list`:

1. `supabase/migrations/20260318235500_initial_schema.sql`
2. `supabase/migrations/20260319091500_harden_relations_and_rls.sql`
3. `supabase/migrations/20260319113000_allow_internal_read_core_tables.sql`

## Tablas y entidades que usa hoy el CMS real

El CMS de Fase 1.5 depende solo de estas piezas:

- `auth.users`
  - sesion real de Supabase Auth
- `public.internal_users`
  - rol interno real y flag `is_active`
- `public.festivals`
  - lectura minima en dashboard y catalogo CMS
- `public.editions`
  - lectura minima en dashboard y catalogo CMS
- `public.events`
  - lectura minima en dashboard y listado de actos CMS
- `public.current_app_role()`
  - resolucion del rol operativo real
- `public.is_internal_user()`
  - apoyo de autorizacion interna en RLS

Todavia no depende funcionalmente de CRUD sobre `categories`, `locations`, `festival_groups` ni `alerts`.

## Variables y credenciales necesarias

### Runtime de la app y scripts locales

Van en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Notas:

- `.env.local` esta ignorado por git
- `scripts/create-internal-user.mjs`, `scripts/seed-cms-demo.mjs` y `scripts/seed-cms-demo-users.mjs` cargan `.env.local` automaticamente
- no hace falta precargar variables a mano en PowerShell para esos scripts

### Credenciales operativas de Supabase CLI

No van al repo ni a `.env.example`. Se usan en shell cuando haga falta:

```bash
SUPABASE_ACCESS_TOKEN=<personal-access-token>
SUPABASE_DB_PASSWORD=<db-password>
```

Uso:

- `SUPABASE_ACCESS_TOKEN`
  - para `npx supabase login` o `npx supabase migration list`
- `SUPABASE_DB_PASSWORD`
  - para `npx supabase link --project-ref <project-ref> --password <db-password>`

## Datos minimos reproducibles

### Seed SQL versionado

Existe un seed local versionado en:

- `supabase/seed.sql`

Ese seed crea o actualiza de forma idempotente:

- 1 festival publicado
- 1 edicion publicada y actual para ese festival
- 1 evento publicado dentro de esa edicion

Este seed se usa al ejecutar:

```bash
npx supabase db reset
```

### Seed remoto reproducible

Para proyectos remotos ya enlazados, existe la utilidad:

```bash
npm run cms:seed-demo
```

Hace lo mismo que `supabase/seed.sql`, pero a traves de `SUPABASE_SERVICE_ROLE_KEY` para no depender de copiar SQL en el editor.

## Usuarios de prueba reproducibles

### Script general

Existe el script:

```bash
npm run cms:create-user -- --email usuario@demo.local --password Secret123! --role admin --active true --name "Usuario Demo"
```

Ahora es idempotente:

- si el usuario no existe en Auth, lo crea
- si ya existe, actualiza password y metadata
- sincroniza la fila en `internal_users`
- falla de forma explicita si detecta conflicto raro de email con otro `id`

### Baseline de usuarios demo

Existe tambien:

```bash
npm run cms:seed-users -- --password Secret123!
```

Crea o actualiza estos usuarios:

- `admin@festapp.local`
  - rol `admin`
  - `is_active = true`
  - sirve para validar acceso completo base del CMS
- `editor@festapp.local`
  - rol `editor`
  - `is_active = true`
  - sirve para validar acceso restringido y denegacion de `/cms/catalogo`
- `inactive@festapp.local`
  - rol `editor`
  - `is_active = false`
  - sirve para validar expulsión del CMS tras login

## Pasos exactos para repetir la conexion en otro entorno

1. Clonar el repo y entrar en la carpeta:

```bash
git clone https://github.com/ekanelx/festapp.git
cd festapp
```

2. Crear `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

3. Instalar dependencias:

```bash
npm install
```

4. Enlazar Supabase CLI al proyecto:

```bash
npx supabase login
npx supabase link --project-ref <project-ref> --password <db-password>
```

5. Aplicar migraciones:

```bash
npx supabase db push
```

6. Verificar que remoto y local coinciden:

```bash
npx supabase migration list
```

Esperado:

- las tres migraciones deben aparecer tanto en `Local` como en `Remote`

7. Cargar baseline minimo reproducible:

```bash
npm run cms:seed-demo
npm run cms:seed-users -- --password Secret123!
```

8. Levantar la app:

```bash
npm run dev
```

## Smoke test exacto

1. Abrir `http://localhost:3000/acceso`
2. Login vacio
   - esperado: `Completa email y password.`
3. Login con password incorrecta
   - esperado: `Credenciales invalidas o acceso no permitido.`
4. Login con `admin@festapp.local`
   - esperado: entra en `/cms`
   - esperado: rol `admin`
   - esperado: puede abrir `/cms/catalogo`
5. Logout
   - esperado: vuelve a `/acceso?message=Sesion cerrada.`
6. Login con `editor@festapp.local`
   - esperado: entra en `/cms`
   - esperado: rol `editor`
   - esperado: no ve `Catalogo` en la navegacion
   - esperado: si abre `/cms/catalogo`, vuelve a `/cms?denied=admin`
7. Login con `inactive@festapp.local`
   - esperado: vuelve a `/acceso?error=Tu usuario no tiene acceso activo al CMS.`
8. Sin sesion, abrir `/cms`
   - esperado: redireccion a `/acceso?reason=auth`

## Lo verificado vs lo no verificado

### Verificado de verdad

- despliegue remoto de migraciones
- seed remoto reproducible
- seed de usuarios reproducible
- acceso `admin`
- restriccion `editor`
- bloqueo `inactive`
- consultas reales del CMS a `festivals`, `editions` y `events`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

### No verificado todavia

- flujo persistente de push a GitHub sin reintroducir credencial
- rotacion real de secretos ya compartidos
- operativa de alta y baja de usuarios internos desde UI
- CRUD de CMS
- catalogo publico completo

## Riesgos pendientes

- las credenciales reales usadas en la validacion deben rotarse si han quedado expuestas fuera del canal operativo esperado
- el acceso a GitHub por HTTPS esta validado a nivel de remoto accesible, pero no se ha configurado un helper persistente de credenciales en esta maquina por seguridad
- el baseline demo usa datos y usuarios pensados para validacion tecnica, no para operacion real
- `WORKING_CONTEXT.md` debe seguir siendo la fuente principal de continuidad y debe actualizarse si cambia el entorno enlazado
