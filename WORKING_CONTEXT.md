# WORKING_CONTEXT

## Objetivo activo

Consolidar Vibecoding-OS como sistema operativo reusable para proyectos con IA, añadiendo memoria operativa viva por repo y reduciendo dependencia de contexto conversacional.

## Estado resumido

- La macroestructura del sistema está cerrada.
- El repo funciona como base documental y operativa, no como aplicación final.
- Existen templates y skills reutilizables ya operativos.
- Falta memoria viva estándar por repo.
- Quedan incoherencias activas: legacy en raíz, archivos truncados, ejemplos duplicados o repartidos.

## Próximos pasos

1. Añadir convención de `WORKING_CONTEXT.md` a las plantillas AGENTS.
2. Crear plantilla reusable de `WORKING_CONTEXT.md`.
3. Limpiar progresivamente solapes entre ejemplos, legacy y artefactos canónicos.

## Riesgos y alertas

- Riesgo de que otra IA use artefactos legacy como si fueran vigentes.
- Riesgo de duplicar estado entre `README` y `WORKING_CONTEXT`.
- Riesgo de que plantillas nuevas no hereden esta convención si no se mete en `TEMPLATE_AGENTS_*`.

## Archivos clave

- `/WORKING_CONTEXT.md`
- `00-Core/README.md`
- `00-Core/DECISIONS_LOG.md`
- `01-Templates/TEMPLATE_AGENTS_MASTER.md`
- `01-Templates/TEMPLATE_AGENTS_NEXT_SUPABASE.md`
- `01-Templates/TEMPLATE_AGENTS_EXISTING_REFACTOR.md`

## Qué no debe asumir un agente nuevo

- Que el `README` refleja el estado vivo actual.
- Que `03-Project-Examples` es automáticamente canónico.
- Que ausencia de nota implica ausencia de conflicto documental.

## Último handoff

### Hecho

Se adopta la necesidad de memoria operativa viva por repo.

### Pendiente inmediato

Aplicarla al sistema base y a las plantillas AGENTS.

### Siguiente paso recomendado

Modificar plantillas AGENTS antes de expandir esta convención a más repos.
---

## Festapp handoff 2026-03-19

### Hecho

- Se ha creado la migracion `supabase/migrations/20260319091500_harden_relations_and_rls.sql`.
- La autorizacion interna deja de confiar solo en el JWT y pasa a validar contra `internal_users` con `is_active = true`.
- Se endurece la RLS publica para no exponer eventos, alertas ni catalogos de festivales o ediciones no publicadas.
- Se anaden triggers para impedir referencias cruzadas entre festivales y para impedir alertas ligadas a actos de otra edicion.

### Pendiente inmediato

- Aplicar ambas migraciones en Supabase antes de arrancar la Fase 1.
- Implementar auth real del CMS usando las funciones `current_app_role()` e `is_internal_user()` ya endurecidas.

### Riesgos abiertos

- Sigue pendiente validar el flujo real de provision de `internal_users` al crear usuarios internos.
- Sigue pendiente decidir si `internal_users` debe ocultarse por completo a `editor` o solo impedir su gestion.

---

## Festapp handoff 2026-03-19 Fase 1

### Hecho

- Se ha implementado login y logout del CMS con Supabase Auth.
- `/cms` queda protegido mediante `proxy.ts` y tambien por comprobacion server-side en el layout.
- Los usuarios sin fila activa en `internal_users` ya no acceden aunque tengan sesion de Auth.
- Se usa `current_app_role()` para resolver roles base `admin` y `editor`.
- `admin` tiene una comprobacion simple de permiso extra en `/cms/catalogo`.
- El CMS ya hace consultas reales a `festivals`, `editions` y `events`.
- Se ha anadido la migracion `supabase/migrations/20260319113000_allow_internal_read_core_tables.sql` para permitir lectura interna de fiestas y ediciones.

### Pendiente inmediato

- Aplicar las tres migraciones en el proyecto Supabase real.
- Crear usuarios internos reales en Auth y su fila correspondiente en `internal_users`.
- Verificar manualmente el flujo completo de login con credenciales reales y datos de prueba.

### Riesgos abiertos

- Aun no existe flujo operativo para provisionar o desactivar usuarios internos desde UI.
- El CMS de Fase 1 solo cubre lectura y control de acceso; el CRUD sigue pendiente para Fase 3.

---

## Festapp handoff 2026-03-19 Fase 1.5

### Hecho

- Se ha dejado una guia operativa real en `docs/implementation/phase-1-5-real-validation.md`.
- `.env.example` documenta ya las variables necesarias para app y utilidad local.
- Existe la utilidad `npm run cms:create-user` para crear usuarios de prueba `admin`, `editor` e `inactive`.
- Se ha saneado la logica compartida de acceso en `lib/cms/auth.ts` para centralizar URLs y mensajes de login.
- Si faltan variables de Supabase, `/acceso` y el proxy muestran feedback minimo en lugar de dejar un fallo opaco.

### Pendiente inmediato

- Crear `.env.local` con el proyecto Supabase real.
- Ejecutar `npx supabase link --project-ref <ref>` y `npx supabase db push`.
- Crear usuarios de prueba con la utilidad local.
- Ejecutar el smoke test documentado para `admin`, `editor` e `inactive`.

### Riesgos abiertos

- El alta y baja de usuarios internos sigue siendo manual por script o panel de Supabase.
- No se ha anadido todavia una vista de administracion de usuarios internos dentro del CMS.

---

## Festapp handoff 2026-03-19 Conexion real

### Hecho

- Se ha configurado `origin` apuntando a `git@github.com:ekanelx/festapp.git`.
- Se ha creado `C:\\dev\\festapp\\.env.local` con URL y claves de Supabase para este entorno.
- `npm run build` pasa usando `.env.local`.
- La comprobacion contra el proyecto Supabase enlazado confirma que el schema de Festapp no estaba desplegado en remoto en ese momento.

### Bloqueos reales

- GitHub por SSH falla con `Permission denied (publickey)`, asi que esta maquina no tiene una clave SSH autorizada para ese repo.
- Supabase responde que no existen `internal_users`, `events`, `editions`, `current_app_role()` ni `is_internal_user()` en schema cache.
- Con `anon` y `service_role` no basta para aplicar migraciones SQL; falta acceso de administracion de Supabase o credenciales de base de datos.

### Pendiente inmediato

- Obtener acceso GitHub por SSH valido o cambiar el remoto a HTTPS con credencial valida.
- Obtener token de acceso de Supabase CLI o password/URL de base de datos para aplicar migraciones.
- Tras eso: `db push`, crear usuarios internos de prueba y ejecutar smoke test del CMS.

---

## Festapp handoff 2026-03-20 Conexion operativa validada

### Hecho

- Se ha cambiado `origin` a `https://github.com/ekanelx/festapp.git` y la comprobacion remota ya responde correctamente por HTTPS.
- Se ha inicializado y enlazado Supabase CLI en el repo con `supabase/config.toml`.
- Se han aplicado en el proyecto real las migraciones actuales con `npx supabase db push`.
- El schema remoto ya contiene las tablas y funciones base de Festapp, incluyendo `internal_users`, `editions`, `events`, `current_app_role()` e `is_internal_user()`.
- Se han creado usuarios de prueba reales para validar `admin`, `editor` e `inactive`.
- Se ha insertado un set minimo de datos reales publicados para que el CMS no dependa de mocks durante la validacion.
- Se ha validado por API y en navegador que `admin` entra al CMS y mantiene acceso a secciones de admin.
- Se ha validado por API y en navegador que `editor` entra al CMS pero queda bloqueado en `/cms/catalogo` y vuelve a `/cms?denied=admin`.
- Se ha validado por API y en navegador que `inactive` autentica en Supabase Auth pero no obtiene rol interno y vuelve a `/acceso` con mensaje de acceso no activo.

### Pendiente inmediato

- Rotar o regenerar credenciales si se han compartido fuera del canal operativo habitual.
- Hacer commit limpio de los cambios de Fase 1/Fase 1.5 y de `supabase/config.toml` si se quiere conservar la configuracion CLI del proyecto.
- Arrancar la siguiente fase funcional sobre una base ya conectada y validada.

### Riesgos abiertos

- El alta y baja de usuarios internos sigue siendo manual por script o panel de Supabase.
- No hay aun gestion de usuarios internos dentro del CMS.
- La validacion visual se ha hecho sobre `npm run dev`; los errores de consola observados son del HMR websocket de Next en desarrollo, no del flujo funcional del CMS.

---

## Festapp handoff 2026-03-20 Cierre tecnico Fase 1.5

### Estado real validado

- GitHub queda conectado por `origin` en HTTPS hacia `https://github.com/ekanelx/festapp.git`.
- El acceso remoto a GitHub se ha validado a nivel de reachability del repo, pero no se ha dejado un helper persistente de credenciales en esta maquina.
- El proyecto Supabase enlazado tiene aplicadas y verificadas estas migraciones:
  - `supabase/migrations/20260318235500_initial_schema.sql`
  - `supabase/migrations/20260319091500_harden_relations_and_rls.sql`
  - `supabase/migrations/20260319113000_allow_internal_read_core_tables.sql`
- El CMS real depende hoy de `auth.users`, `internal_users`, `festivals`, `editions`, `events`, `current_app_role()` e `is_internal_user()`.
- El baseline minimo remoto ya no depende de SQL manual copiado en el editor:
  - `supabase/seed.sql` sirve para `npx supabase db reset` en local
  - `npm run cms:seed-demo` sincroniza festival, edicion y acto demo en remoto
  - `npm run cms:seed-users -- --password <password>` sincroniza usuarios `admin`, `editor` e `inactive`
- `npm run cms:create-user` ahora carga `.env.local` automaticamente y es idempotente para poder repetir altas de prueba sin limpiar estado a mano.
- Queda verificado en navegador y por API:
  - `admin` entra y accede a `/cms/catalogo`
  - `editor` entra pero rebota desde `/cms/catalogo` a `/cms?denied=admin`
  - `inactive` autentica en Auth pero no entra al CMS y vuelve a `/acceso`
- `npm run lint`, `npm run typecheck` y `npm run build` siguen pasando con `.env.local`.

### Supuestos o limites que siguen siendo eso

- No se ha verificado una estrategia persistente de credenciales para `git push` o `git pull` en esta maquina.
- No se ha verificado rotacion de secretos tras haber sido compartidos fuera del flujo normal.
- No se ha verificado todavia provision de usuarios internos desde UI porque sigue fuera de alcance.
- No se ha validado ningun CRUD ni el catalogo publico completo.

### Pasos exactos para repetir esta validacion en otro entorno

1. Crear `.env.local` con `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.
2. Ejecutar `npm install`.
3. Ejecutar `npx supabase login`.
4. Ejecutar `npx supabase link --project-ref <project-ref> --password <db-password>`.
5. Ejecutar `npx supabase db push`.
6. Ejecutar `npx supabase migration list` y comprobar que local y remoto contienen las tres migraciones actuales.
7. Ejecutar `npm run cms:seed-demo`.
8. Ejecutar `npm run cms:seed-users -- --password Secret123!`.
9. Ejecutar `npm run dev`.
10. Repetir smoke test de `/acceso`, `/cms`, `/cms/catalogo` y logout con `admin`, `editor` e `inactive`.

### Riesgos pendientes

- Las credenciales reales compartidas para esta validacion deben rotarse o regenerarse.
- El entorno local depende de `.env.local`; eso esta bien para desarrollo, pero no debe copiarse a archivos versionados.
- `supabase/.temp` contiene metadatos locales del CLI y debe seguir ignorado.
- Los usuarios y datos demo actuales son de validacion tecnica, no de operacion de contenido.

### Acciones manuales fuera del repo

- Rotacion de credenciales reales usadas durante la validacion.
- Definir y configurar un metodo seguro de autenticacion GitHub en esta maquina para `git push` y `git pull`.
- Hacer commit y push de cierre de Fase 1.5 cuando se decida fijar este baseline.

### Siguiente paso recomendado

- Mantener Fase 1.5 cerrada en commit limpio antes de abrir la siguiente fase funcional.

---

## Festapp handoff 2026-03-20 Vertical publico read-only inicial

### Hecho

- `/` ya no es una landing placeholder: resuelve la edicion publica activa y redirige a `/:festivalSlug/:editionSlug`.
- La home publica de edicion y la agenda read-only ya leen Supabase real sin mocks.
- La lectura publica actual consume `festivals`, `editions`, `events` y la relacion opcional con `locations`.
- La UI publica muestra solo lo minimo util por acto:
  - titulo
  - fecha y hora
  - ubicacion principal si existe
  - estado visible solo si aplica al usuario final
- Hay estado vacio claro si una edicion no tiene actos publicados.
- Hay estado de error simple si falla la carga de Supabase.
- El footer publico deja claro que el baseline demo es tecnico y no editorial.

### Fuera de alcance deliberadamente

- Detalle completo de acto
- Mapa o salida a Google Maps
- Alertas avanzadas
- Filtros complejos
- CRUD publico o interno nuevo

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Comprobacion manual en servidor `dev` limpio:
  - `/` redirige a `/:festivalSlug/:editionSlug`
  - `/:festivalSlug/:editionSlug` carga contenido real
  - `/:festivalSlug/:editionSlug/agenda` lista actos reales

---

## Festapp handoff 2026-03-20 Ajuste UX vertical publico

### Hecho

- La home publica se ha simplificado para no competir con la agenda como nucleo real de consulta.
- Se ha eliminado copy tecnico de scaffold del UI publico.
- La agenda ahora ordena y agrupa actos por dia, con la hora como referencia visual dominante.
- Las tarjetas publicas muestran solo lo util para consulta rapida:
  - hora
  - nombre del acto
  - ubicacion principal o mensaje claro si falta
  - estado visible solo si aporta al usuario final
- La navegacion publica ya no expone el acceso al CMS.

### Pendiente deliberado

- No se ha abierto detalle de acto.
- No se han activado alertas publicas.
- No se han anadido filtros complejos ni mapa.

---

## Festapp handoff 2026-03-20 Validacion publica con seed realista

### Hecho

- `npm run cms:seed-demo` ya sincroniza un baseline tecnico mas util:
  - 1 festival
  - 1 edicion activa
  - 16 actos publicados
  - varios dias y horas
  - ubicaciones mixtas
  - estados `updated` y `cancelled`
- `supabase/seed.sql` refleja ese mismo baseline tecnico para entornos locales.
- El boton principal `Abrir agenda` se ha rehecho con contraste alto y jerarquia mas clara.
- La navegacion publica entre resumen y agenda ya existe con tabs contextuales minimos.
- La semantica actual queda cerrada asi:
  - `/` redirige a la edicion activa
  - `/:festivalSlug/:editionSlug` es resumen de edicion
  - `/:festivalSlug/:editionSlug/agenda` es agenda publica

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Comprobacion manual con servidor local:
  - resumen con actos de hoy
  - agenda agrupada por dia
  - estados visibles
  - CTA principal legible

---

## Festapp handoff 2026-03-20 Detalle publico read-only de acto

### Hecho

- La ruta publica `/:festivalSlug/:editionSlug/actos/:eventSlug` deja de ser placeholder y ya lee Supabase real.
- El detalle valida contexto por festival + edicion + slug de acto para no mezclar contenido entre ediciones.
- La agenda publica enlaza cada acto real a su ficha de detalle.
- La ficha muestra solo la informacion esencial pedida:
  - nombre del acto
  - fecha y hora
  - contexto de festival y edicion
  - ubicacion principal si existe
  - estado visible cuando aporta (`updated`, `cancelled`, `finished`)
  - descripcion breve solo si existe
  - mensaje claro si la ubicacion esta pendiente o no publicada
- La capa publica de queries ahora tambien lee `short_description`, `change_note` y direccion de `locations`.
- El seed demo local y remoto ya incluye descripciones breves y notas de cambio minimas para que el detalle no quede vacio en actos clave.
- Se ha resincronizado el baseline real con `npm run cms:seed-demo`.

### Fuera de alcance deliberadamente

- mapa
- salida a Google Maps
- alertas en detalle
- compartir
- favoritos
- filtros o busqueda nuevos
- cambios en CMS o schema mas alla del uso de campos ya existentes

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- comprobacion de datos reales en Supabase para:
  - `apertura-del-mercado-medieval`
  - `mascleta-de-mediodia`
  - `entrada-de-bandas`

### Siguiente paso recomendado

- Mantener esta ficha publica estable y pasar a la siguiente pieza funcional del catalogo sin rehacer UX base.
