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

---

## Festapp handoff 2026-03-20 Cierre real del vertical CMS de actos

### Problema raiz resuelto

- El CMS de actos estaba interpretando las relaciones anidadas de Supabase como arrays (`relation?.[0]`) cuando en este proyecto estaban llegando como objeto.
- Ese supuesto roto anulaba `edition`, `festival` y `location` en actos validos.
- Consecuencia directa:
  - el listado mostraba contexto editorial vacio
  - algunas fichas devolvian `No se ha podido resolver el festival asociado a este acto`
  - la carga de locations validas quedaba bloqueada por un falso error de resolucion

### Hecho

- `lib/cms/queries.ts` ahora normaliza relaciones anidadas aceptando tanto objeto como array con `unwrapRelation()`.
- `/cms/actos` vuelve a mostrar festival y edicion correctos para actos reales del seed en ambos festivales demo.
- `/cms/actos/:eventId` carga correctamente fichas reales y resuelve las `locations` del festival asociado.
- El listado queda mas operativo sin rediseño:
  - orden estable por `starts_at` y `title`
  - resumen superior con numero de actos
  - mensaje explicito `Contexto editorial no resuelto` si algun dato futuro viniera realmente roto
- Se ha validado en navegador con Supabase real:
  - login `admin`
  - login `editor`
  - apertura de fichas reales de `Moros y Cristianos` y `Feria de Primavera`
  - guardado real en CMS
  - revalidacion visible en el front publico para un acto `updated`
- `npm run lint`, `npm run typecheck` y `npm run build` siguen pasando.

### Pendiente inmediato

- Ninguno dentro de este vertical salvo bugs reales encontrados en uso.

### Riesgos abiertos

- Los errores de consola vistos en Playwright durante `npm run dev` siguen siendo ruido de desarrollo de Next/HMR, no un fallo funcional del vertical.
- Si en el futuro entra un acto con integridad editorial realmente rota en base de datos, el CMS ya lo mostrara como dato invalido, pero no lo corrige automaticamente.

### Siguiente paso recomendado

- Mantener cerrado el vertical CMS de actos y no ampliarlo salvo correcciones puntuales o cambios de producto expresos.
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

## Festapp handoff 2026-03-20 Reordenacion estructural del CMS

### Problema resuelto

- El CMS habia crecido como suma de pantallas sueltas:
  - `/cms/actos`
  - `/cms/catalogo`
  - `/cms/alertas`
- Aunque actos ya funcionaba, el flujo editorial seguia sin reflejar el dominio real `festival -> edicion -> actos`.
- Eso hacia que el mantenimiento de contenido se sintiera disperso y que el editor de actos viviera aislado del contexto donde realmente se decide el trabajo.

### Hecho

- La navegacion del CMS ahora se centra en:
  - `/cms`
  - `/cms/festivales`
  - `/cms/ediciones`
- Existen rutas operativas nuevas para recorrer el arbol editorial:
  - `/cms/festivales/:festivalId`
  - `/cms/ediciones/:editionId`
  - `/cms/ediciones/:editionId/actos`
  - `/cms/actos/:eventId`
- El listado real de actos no se ha rehecho:
  - se ha extraido a componente reutilizable
  - ahora vive dentro de `/cms/ediciones/:editionId/actos`
- La ficha de acto mantiene guardado y contexto, pero deja de volver a un listado global aislado y pasa a enlazar con su edicion y sus actos.
- Las rutas antiguas se reconducen para no competir con el flujo nuevo:
  - `/cms/actos` redirige a `/cms/ediciones`
  - `/cms/catalogo` redirige a `/cms/festivales`
  - `/cms/alertas` redirige a `/cms`
- El guardado del acto revalida tambien las nuevas rutas editoriales de festival y edicion.

### Fuera de alcance deliberadamente

- CRUD completo de festivales
- CRUD completo de ediciones
- alertas operativas de CMS
- media library
- acciones masivas
- analitica
- usuarios internos

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Smoke manual en navegador con Supabase real:
  - `/cms`
  - `/cms/festivales`
  - `/cms/festivales/:festivalId`
  - `/cms/ediciones/:editionId`
  - `/cms/ediciones/:editionId/actos`
  - `/cms/actos/:eventId`
  - redireccion real de `/cms/actos` a `/cms/ediciones`
  - redireccion real de `/cms/catalogo` a `/cms/festivales`

### Siguiente paso recomendado

- Mantener esta estructura como base del CMS y abrir futuras capacidades siempre dentro del arbol editorial, no como verticales sueltos.

---

## Festapp handoff 2026-03-20 Cierre del flujo minimo festival -> edicion -> actos

### Problema resuelto

- La reordenacion estructural del CMS ya daba contexto, pero aun no habia operacion real sobre el dominio base:
  - el festival no se podia editar
  - la edicion no se podia editar ni crear dentro del festival
  - el acto no se podia crear desde la edicion
- Eso hacia que el CMS siguiera siendo, en la practica, navegacion mas ficha de acto, pero no un flujo editorial completo.

### Hecho

- El festival ya tiene ficha editable minima en `/cms/festivales/:festivalId`:
  - nombre
  - ciudad
  - zona horaria por defecto
  - estado
  - descripcion breve
- La edicion ya se opera subordinada al festival:
  - se crea desde `/cms/festivales/:festivalId`
  - se edita en `/cms/ediciones/:editionId`
  - el acceso transversal `/cms/ediciones` se mantiene, pero pasa a ser secundario y ya no vive en la navegacion principal
- El acto ya nace desde la edicion con `/cms/ediciones/:editionId/actos/nuevo`.
- La ficha de acto sigue reutilizando el guardado existente y queda integrada como ultimo paso del arbol editorial.
- Se ha reforzado el naming editorial para dar mas peso al festival:
  - ejemplo real: `Moros y Cristianos de Alcoy - 2026`
- Se han reforzado CTAs criticos con botones de mejor contraste en festival, edicion y actos.
- Las rutas legacy siguen reconducidas para no reabrir dispersión:
  - `/cms/actos` -> `/cms/ediciones`
  - `/cms/catalogo` -> `/cms/festivales`
  - `/cms/alertas` -> `/cms`

### Permisos y alcance real

- Edicion y creacion de festivales/ediciones quedan solo para `admin`, alineado con las policies actuales.
- Creacion y edicion de actos siguen disponibles dentro del flujo editorial ya existente para usuarios internos del CMS.

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Smoke manual en navegador con Supabase real:
  - guardar un festival real
  - guardar una edicion real subordinada a su festival
  - crear un acto desde una edicion y llegar a su ficha
  - validar despues la limpieza de los datos de prueba creados para no dejar ruido en el dataset

### Fuera de alcance deliberadamente

- alertas CMS operativas
- media library
- editor rico
- acciones masivas
- analitica
- usuarios internos nuevos
- borrado completo de entidades desde UI

### Siguiente paso recomendado

- Mantener cerrado este baseline operativo del CMS y abrir solo mejoras que sigan respetando el flujo principal `festival -> edicion -> actos`.

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

---

## Festapp handoff 2026-03-20 Home global publica

### Hecho

- `/` ya no redirige automaticamente a una sola edicion activa y pasa a ser la home global publica de Festapp.
- La home global lee Supabase real y lista ediciones publicadas que siguen vigentes o proximas.
- Cada item enlaza directamente al resumen de su edicion.
- La home muestra solo contexto minimo para decidir rapido:
  - nombre del festival
  - nombre de edicion
  - ciudad si existe
  - rango de fechas
  - estado temporal simple (`Hoy`, `En curso`, `Proximamente`)
  - numero de actos publicados cuando ayuda
- Se mantiene el vertical por edicion sin rehacerlo:
  - resumen de edicion
  - agenda
  - detalle de acto
- El seed demo se amplia con un segundo festival proximo para validar la home global con datos reales:
  - `moros-y-cristianos` en curso
  - `feria-de-primavera` proximo
- Se ha resincronizado el baseline real con `npm run cms:seed-demo`.

### Fuera de alcance deliberadamente

- seguir festivales
- favoritos
- login publico
- mapa
- busqueda compleja
- filtros avanzados
- cambios en CMS

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- comprobacion de datos reales en Supabase para confirmar dos ediciones visibles y cercanas:
  - `moros-y-cristianos / 2026`
  - `feria-de-primavera / 2026`

### Siguiente paso recomendado

- Mantener estable la home global y abrir la siguiente pieza funcional sin volver a pulir UX publica salvo bugs.

---

## Festapp handoff 2026-03-20 Salida minima a mapas

### Hecho

- El detalle publico del acto ya puede mostrar un CTA de `Abrir en mapas` cuando la ubicacion es resoluble con datos reales.
- La resolucion se apoya en datos ya existentes de `locations`:
  - `google_maps_url` si existiera
  - si no, busqueda simple por `name + address`
- No se ha anadido mapa embebido ni integracion compleja.
- El CTA se oculta cuando la ubicacion esta pendiente, no publicada o no tiene direccion suficiente.
- No ha hecho falta cambiar schema ni seed para validar esta funcionalidad porque las ubicaciones publicadas actuales ya tienen `address`.

### Fuera de alcance deliberadamente

- mapa embebido
- librerias de mapas
- calculo interno de rutas
- favoritos
- alertas
- share avanzado

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- comprobacion de datos reales en Supabase:
  - `apertura-del-mercado-medieval` tiene `address` suficiente
  - `entrada-de-bandas` no muestra CTA por `location_pending = true`
  - `cierre-infantil` no muestra CTA por `location_pending = true`

### Siguiente paso recomendado

- Mantener esta salida simple a mapas y solo abrir mapa embebido o mejoras de rutas si aparece una necesidad real posterior.

---

## Festapp handoff 2026-03-20 Visibilidad publica de cambios

### Hecho

- La experiencia publica ahora hace mas visibles los actos `updated` y `cancelled` sin abrir una capa nueva de alertas.
- La agenda refuerza visualmente los actos con cambios:
  - color de tarjeta mas expresivo segun estado
  - etiqueta de estado mas visible
  - `change_note` visible en lista cuando existe
- El resumen de edicion muestra un bloque pequeno de `Cambios relevantes` cuando existen actos actualizados o cancelados.
- El detalle de acto destaca los cambios operativos con un bloque superior de `Cambio relevante` cuando el estado es `updated` o `cancelled`.
- Los estados que no aportan como cambio operativo no se sobrerrepresentan en ese bloque.
- Todo sigue leyendo datos reales existentes de `events`, incluyendo `status` y `change_note`.

### Fuera de alcance deliberadamente

- push notifications
- favoritos
- login publico
- backend de suscripciones
- centro complejo de alertas
- cambios en CMS

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- comprobacion de datos reales con actos que ya usan cambios publicados:
  - `apertura-del-mercado-medieval`
  - `mascleta-de-mediodia`
  - `embajada-mora`
  - `tardeo-de-charangas`

### Siguiente paso recomendado

- Mantener esta capa de visibilidad de cambios como baseline suficiente hasta que llegue una fase especifica de alertas o push.

---

## Festapp handoff 2026-03-20 Vertical CMS de actos

### Hecho

- `/cms/actos` deja de ser solo lectura tecnica y pasa a ser un listado operativo de actos reales.
- Existe ya una ficha simple por acto en `/cms/actos/:eventId`.
- La ficha permite editar los campos clave que ya afectan al front publico:
  - `title`
  - `slug`
  - `starts_at`
  - `status`
  - `review_status`
  - `short_description`
  - `change_note`
  - `location_id`
  - `location_pending`
- La ficha muestra contexto minimo de operacion:
  - festival
  - edicion
  - estado actual
  - publicacion actual
  - enlaces al front publico
- El guardado usa Supabase real con las policies actuales de `events`, valido tanto para `admin` como para `editor`.
- Al guardar se revalida:
  - `/cms`
  - `/cms/actos`
  - ficha CMS del acto
  - `/`
  - resumen de edicion
  - agenda
  - detalle publico del acto
- Se ha actualizado el copy del CMS para no seguir diciendo que no habia CRUD operativo en actos.

### Fuera de alcance deliberadamente

- gestion completa de festivales o ediciones
- media library
- editor rico
- acciones masivas
- vertical de alertas
- usuarios internos
- analitica

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Siguiente paso recomendado

- Mantener este vertical de actos como base editorial y abrir despues solo el siguiente slice operativo realmente necesario del CMS.

---

## Festapp handoff 2026-03-20 Refinado operativo CMS festival -> edicion -> actos

### Hecho

- Se ha corregido el bug real de alta de ediciones que acababa en `editions_check`:
  - ahora se valida en servidor que `ends_on >= starts_on`
  - el usuario ve el error comprensible `La fecha de fin no puede quedar antes de la fecha de inicio.`
  - el mismo control se aplica tambien al guardado de una edicion existente
- Se ha cerrado un caso operativo adicional:
  - si se intenta marcar una edicion como actual y el alta o guardado falla, se restaura la edicion actual previa para no dejar el festival sin referencia actual
- Se ha introducido el patron `vista/contexto + boton Editar + panel lateral` para entidades existentes:
  - `/cms/festivales/:festivalId`
  - `/cms/ediciones/:editionId`
- La creacion sigue como accion primaria visible:
  - `Nuevo festival` en `/cms/festivales`
  - `Nueva edicion` dentro del festival
  - `Nuevo acto` dentro de la edicion
- Se ha anadido la ruta dedicada de alta `/cms/festivales/nuevo`.
- Se han reforzado CTAs criticos para legibilidad y contraste:
  - botones oscuros con texto blanco en acciones primarias
  - enlaces publicos del CMS de edicion pasan a botones legibles
- Se ha ajustado el home CMS para que el paso principal ya no enlace a `/cms/ediciones` como si fuera el flujo principal.
- Se ha cerrado una fuga de permisos en la UX:
  - `editor` ya no ve el CTA `Nueva edicion` en la ficha del festival
  - `Nuevo festival` sigue visible solo para `admin`

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Validacion en navegador con Supabase real usando Playwright CLI:
  - login `admin`
  - `/cms/festivales` muestra `Nuevo festival`
  - `/cms/festivales/:festivalId` ya no abre el formulario por defecto y muestra `Editar festival` + `Nueva edicion`
  - el drawer de festival abre y guarda correctamente; el cambio de prueba en `short_description` se revirtio
  - la alta de edicion con fin anterior al inicio devuelve el error esperado y no rompe la pantalla
  - `/cms/ediciones/:editionId` ya no abre el formulario por defecto y muestra `Editar edicion` + `Nuevo acto`
  - el drawer de edicion abre y guarda correctamente; el cambio de prueba en el nombre se revirtio
  - `/cms/festivales/nuevo` carga el formulario dedicado de alta
  - login `editor`
  - `editor` no ve `Nuevo festival` en `/cms/festivales`
  - `editor` no ve CTAs de alta/edicion de festival que no puede usar

### Fuera de alcance deliberadamente

- media library
- alertas operativas
- analitica
- acciones masivas
- rediseño visual profundo del CMS

### Siguiente paso recomendado

- Mantener el trabajo siguiente dentro del mismo arbol editorial y evitar volver a incrustar formularios persistentes de edicion en fichas existentes.

---

## Festapp handoff 2026-03-20 Base UI CMS y alta dedicada de edicion

### Hecho

- Se ha introducido una capa base `components/ui` de estilo shadcn-like para estabilizar los controles criticos del CMS:
  - `Button`
  - `Input`
  - `Textarea`
  - `Select`
  - `Checkbox`
  - `Card`
  - `Badge`
- `SectionCard` ya se apoya en la nueva base `Card`.
- La causa raiz del bug visual era la ausencia de una capa comun de variantes:
  - habia demasiadas clases hardcodeadas por pantalla
  - los CTAs dependian de combinaciones locales de `bg-*` y `text-*`
  - eso hacia facil acabar con foreground/background incoherentes al tocar una pantalla concreta
- Ahora los CTAs principales del CMS usan `buttonVariants()` en vez de repetir clases manuales:
  - `Nuevo festival`
  - `Nueva edicion`
  - `Editar festival`
  - `Editar edicion`
  - `Ver actos`
  - `Crear edicion`
  - `Crear acto`
  - `Guardar festival`
  - `Guardar edicion`
  - `Guardar cambios`
- La ficha de festival ya no contiene el formulario de alta de edicion.
- `Nueva edicion` sale ahora a una ruta dedicada:
  - `/cms/festivales/:festivalId/ediciones/nueva`
- La accion `createEditionAction` ya redirige los errores de validacion a esa nueva ruta dedicada, no de vuelta a la ficha del festival.
- El patron queda asi:
  - festival existente = vista + editar en panel lateral
  - edicion existente = vista + editar en panel lateral
  - nuevo festival = pagina dedicada
  - nueva edicion = pagina dedicada
  - nuevo acto = pagina dedicada

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Validacion en navegador con Supabase real usando Playwright CLI:
  - `admin`:
    - la ficha de festival ya no muestra el alta de edicion incrustada
    - `Nueva edicion` navega a `/cms/festivales/1203285d-fdea-4abc-8123-97f4ce0c0eeb/ediciones/nueva`
    - la pantalla dedicada muestra el formulario principal de alta
    - un error real de fechas invalidas se queda en esa misma ruta dedicada con mensaje claro
  - `editor`:
    - no ve CTAs de alta/edicion de festival que no puede usar
- La ruta nueva aparece en build:
  - `/cms/festivales/[festivalId]/ediciones/nueva`

### Fuera de alcance deliberadamente

- rediseño profundo del CMS
- alertas operativas
- media library
- analitica
- acciones masivas

### Siguiente paso recomendado

- Mantener cualquier ajuste futuro del CMS sobre esta capa `components/ui` y evitar volver a mezclar CTAs criticos con clases manuales por pantalla.

---

## Festapp handoff 2026-03-20 Foundation de design system para migracion progresiva

### Hecho

- Se ha formalizado una foundation real de design system en `app/globals.css` con tres capas de tokens:
  - primitive tokens
  - semantic tokens
  - component tokens
- La base visual inicial queda orientada a Festapp como UI sobria, funcional y premium ligera:
  - superficies calidas
  - contraste estable
  - densidad controlada
  - estados interactivos coherentes
- La arquitectura de componentes queda separada asi:
  - `components/ui` = primitives inspiradas en shadcn/ui
  - `components/shared` = themed components de Festapp
  - `components/cms` y `components/public` = componentes de dominio
- Se han consolidado o introducido los primitives criticos:
  - `Button`
  - `Input`
  - `Textarea`
  - `Select`
  - `Checkbox`
  - `Label`
  - `Card`
  - `Badge`
  - `Drawer`
  - `Table`
- `CmsSidePanel` ya se apoya en la base `Drawer`.
- `SectionCard` ya se apoya en la base `Card`.
- El listado de actos del CMS ya usa `Badge` para estados relevantes.
- La migracion minima de prueba se ha aplicado a las zonas mas sensibles del CMS:
  - CTAs principales
  - formularios de festival, edicion y acto
  - estados editoriales
  - panel lateral de edicion
- Se ha añadido documentacion tecnica breve en:
  - `docs/design-system/foundation.md`

### Causa raiz consolidada

- El problema real no era un solo boton roto, sino la ausencia de una capa comun de variantes y semantica visual.
- Los CTAs criticos dependian de clases locales por pantalla y de combinaciones manuales de `bg-*`, `text-*` y `hover:*`.
- Eso hacia facil introducir foreground/background inconsistentes y muy dificil ajustar contraste o densidad de forma centralizada.
- La nueva base desplaza esos ajustes a tokens y variantes compartidas.

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Fuera de alcance deliberadamente

- migracion masiva de toda la app publica
- storybook
- tematizacion avanzada con multiples skins
- rediseño completo del CMS o del catalogo publico

### Siguiente paso recomendado

- Continuar futuras migraciones pantalla a pantalla sobre `components/ui` y `components/shared`, evitando volver a introducir variantes visuales locales para controles criticos.

---

## Festapp handoff 2026-03-20 Segunda pasada de consolidacion del design system

### Hecho

- Se ha simplificado la jerarquia de tokens en `app/globals.css`:
  - se mantienen `primitive tokens`
  - se mantienen `semantic tokens`
  - se eliminan `component tokens` redundantes que solo duplicaban semantica ya existente
- Los primitives quedan con contratos mas claros:
  - `Input`, `Textarea` y `Select` comparten `controlBaseClassName`
  - `Checkbox` ya no acepta `type` ambiguo
  - `Card`, `Drawer`, `Table`, `Label` y `Badge` usan semantica comun en vez de colores hardcodeados
  - `Button.link` pasa a usar el tono de accion textual comun del sistema
- La frontera entre capas queda mas nitida:
  - `components/ui` conserva primitives base
  - `components/shared` gana solo patrones realmente repetidos y con responsabilidad clara:
    - `Callout`
    - `InfoTile`
    - `FormField`
    - `CheckboxField`
  - `components/cms` sigue conteniendo composicion de dominio
- Se ha pulido la consistencia visual del CMS ya migrado:
  - formularios con labels, hints y toggles alineados
  - bloques de contexto y metricas unificados
  - mensajes operativos sobre `Callout`
  - mejor consistencia de alturas y foco en controles
  - menos mezcla de clases locales para cajas y estados
- Se ha ampliado `docs/design-system/foundation.md` para convertirlo en guia operativa real:
  - cuando tocar tokens
  - cuando tocar primitives
  - cuando crear shared components
  - que evitar
  - deuda tecnica breve y priorizada

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Deuda abierta deliberadamente

- `P1` Migrar login y algunos controles publicos a la misma foundation
- `P1` Reducir colores inline que aun quedan en catalogo publico
- `P2` Revalidar si `Table` necesita una primera adopcion real o puede esperar
- `P2` Consolidar un patron shared de empty state solo si aparece un tercer caso claro

### Siguiente paso recomendado

- Mantener futuras migraciones sobre esta base y no volver a introducir wrappers de pantalla cuando el problema real sea de token, primitive o patron shared repetido.

---

## Festapp handoff 2026-03-20 Correccion visual del CMS y CTA operativos

### Hecho

- Se ha corregido el output visual real del CMS en las vistas prioritarias:
  - `/cms`
  - `/cms/festivales`
  - `/cms/festivales/nuevo`
  - `/cms/festivales/:festivalId`
  - `/cms/ediciones/:editionId`
- `Button` vuelve a tener jerarquia visual util:
  - `default` como CTA principal legible y con peso real
  - `outline` como accion secundaria visible
  - `ghost` para navegacion contextual sobre fondo oscuro
  - `link` como accion textual de apoyo
- Se ha ajustado el uso de variantes en festival y edicion:
  - en festival, `Nueva edicion` pasa a primaria y `Editar festival` queda secundaria
  - en edicion, `Nuevo acto` queda primario en cabecera y `Editar edicion` secundario
  - en el bloque de programa, `Entrar a actos` queda primario y el resto baja de jerarquia
- Se han diferenciado mejor superficies:
  - `InfoTile` sigue como bloque de contexto o metrica
  - los listados navegables pasan a `surface-strong` con borde y sombra ligera
- La cabecera del CMS ya usa navegacion y signout visibles sobre fondo oscuro.

### Problema raiz corregido

- El bug mas grave de los CTAs no era solo la variante `default`.
- Los links que usaban `buttonVariants()` seguian perdiendo el color del texto por la cascada del navegador y del CSS global.
- Se ha cerrado con clases especificas del sistema (`ui-button-*`) y color forzado en `globals.css` para que los CTAs sigan siendo legibles tambien cuando se renderizan como `<a>`.

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Revision visual real con Playwright sobre las cinco vistas prioritarias

### Siguiente paso recomendado

- Mantener esta prioridad de output visual en las siguientes iteraciones del CMS y revisar siempre los CTAs clave con captura o navegador real antes de dar por buena una pasada visual.

---

## Festapp handoff 2026-03-20 Iteracion UX/UI CMS sin rediseño

### Hecho

- Se ha aplicado una cabecera operativa comun a las pantallas CMS prioritarias:
  - `/cms`
  - `/cms/festivales`
  - `/cms/festivales/nuevo`
  - `/cms/festivales/:festivalId`
  - `/cms/festivales/:festivalId/ediciones/nueva`
  - `/cms/ediciones`
  - `/cms/ediciones/:editionId`
  - `/cms/ediciones/:editionId/actos`
  - `/cms/actos/:eventId`
- La cabecera superior del layout deja de comportarse como hero decorativo y pasa a una barra mas compacta con navegacion tipo tabs y sesion visible.
- `CmsBreadcrumbs` baja peso visual:
  - tamano menor
  - menos contraste
  - deja de competir con el titulo
- La home CMS se simplifica como puente operativo:
  - CTA principal a festivales
  - accesos rapidos a ediciones recientes
  - metricas relegadas a un papel secundario
- El listado de festivales elimina la redundancia `card + boton abrir`:
  - la card completa abre el festival
  - el CTA principal de la pagina queda reservado a `Nuevo festival`
  - la metadata del festival se compacta en badges y anos de edicion
- La ficha de festival mantiene estructura pero se compacta:
  - contexto estructural mas claro
  - metricas resumidas con menos competencia
  - el bloque de ediciones gana protagonismo como siguiente paso natural
- La creacion de edicion mantiene pagina dedicada y mejora:
  - jerarquia del formulario
  - bloque de contexto del festival mas ligero
  - checkbox `Marcar como edicion actual` con copy operativo
  - errores de fechas junto al grupo afectado usando `field=dates`
- La ficha de edicion se afina sin rehacerse:
  - `Nuevo acto` sigue siendo CTA principal
  - `Editar edicion` sigue subordinado
  - `Entrar a actos` sigue siendo accion principal del bloque de programa
  - enlaces publicos bajan a acciones textuales secundarias
  - preview de actos recientes pasa a un formato mas denso y escaneable
- `CmsEventsList` deja de usar boton redundante `Abrir ficha`:
  - la tarjeta completa abre la ficha del acto
  - soporta densidad `compact`
  - hace mas visible `cancelled`, `updated` e `in_review`
  - deja de mostrar textos de relleno como `Sin descripcion breve`
- El listado de actos añade utilidad editorial minima sin convertirlo en tabla enterprise:
  - busqueda simple
  - filtro por estado
  - orden por fecha o actualizacion reciente usando `updated_at`
  - la accion publica `Ver agenda publica` baja a link secundario
- La ficha de acto se reorganiza visualmente en grupos:
  - identidad publica
  - programacion y publicacion
  - cambios y comunicacion
  - contexto relacionado
- En la ficha de acto `Ver en publico` ya no compite con el flujo editorial:
  - queda como link secundario
  - `Guardar cambios` mantiene el peso principal dentro del formulario

### Trade-offs asumidos

- No se ha abierto una re-arquitectura del design system:
  - se anade `CmsPageHeader`
  - `SectionCard` se flexibiliza un poco para evitar duplicar estructuras
- El filtro del listado de actos usa estado visible e `in_review`, no una taxonomia nueva de workflow.
- La ordenacion por "actualizacion reciente" se resuelve con `updated_at` ya existente en schema; no se ha anadido nueva logica de tracking.
- Las cards de ediciones mantienen accion secundaria `Ver actos`; no se fuerzan como cards completamente clickables porque ahi si hay una segunda accion real.

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Siguiente paso recomendado

- Hacer revision visual real en navegador del CMS ya afinado para ajustar solo detalles finos de espaciado o copy si aparecieran en uso, sin reabrir una nueva capa de rediseño.

---

## Festapp handoff 2026-03-20 Refinado publico inspirado en Stitch

### Hecho

- Se ha refinado la app publica sobre la base compartida del design system, sin crear una capa visual paralela.
- Las tres pantallas objetivo ya usan una direccion editorial mas calmada y premium funcional:
  - `/`
  - `/:festivalSlug/:editionSlug`
  - `/:festivalSlug/:editionSlug/actos/:eventSlug`
- La traduccion sistemica aplicada ha sido:
  - primitives existentes:
    - `Card`
    - `Button`
    - `Badge`
    - `SectionCard`
  - nuevas variantes del DS:
    - `Card.editorial`
    - `Card.soft`
    - `Card.strong`
    - `Button.accent`
    - `Badge.accent`
    - `Badge.soft`
  - componentes publicos reutilizables:
    - `PublicHeroBlock`
    - `PublicMediaPlaceholder`
    - `PublicMetaRow`
    - `PublicInfoPanel`
    - `PublicStoryCard`
- `SiteHeader` y `SiteFooter` se han alineado con la direccion publica refinada usando la misma base de botones y superficies.
- `PublicEditionNav` pasa a una navegacion flotante ligera con la misma semantica de variantes que el resto del sistema.
- `EditionOverview` deja atras parte del estilo inline y se apoya en componentes publicos/shared para mantener coherencia con home, resumen y detalle.
- `lib/public/queries.ts` expone solo el contexto adicional minimo necesario para esta capa visual:
  - `temporalLabel` en la home de edicion
  - `festivalCity` y `editionDateRangeLabel` en detalle de acto

### Decision visual clave

- Stitch usa fotografia editorial en hero y cards, pero el producto real no tiene hoy imagen publica en estas queries.
- En lugar de inventar imagenes falsas o meter mocks visuales, se ha creado `PublicMediaPlaceholder`:
  - funciona como activo editorial reusable
  - mantiene el ritmo visual y las capas de Stitch
  - evita prometer un contenido multimedia que el producto real aun no ofrece

### Lo que no se ha copiado literalmente

- No se ha copiado el HTML de Stitch.
- No se han anadido buscadores, bottom nav, mapas interactivos, carruseles ni CTA de marketing que no existan en Festapp.
- No se ha llevado al sistema la regla extrema de "cero borde" de forma literal:
  - se ha aproximado con variantes `editorial` y `soft`
  - se mantienen bordes y sombras donde la claridad operativa del producto lo sigue agradeciendo

### Compatibilidad con el CMS

- Los nuevos tokens y variantes amplian la foundation existente en vez de bifurcarla.
- El CMS sigue apoyandose en `default`, `outline`, `ghost` y `link`; no se ha cambiado su jerarquia ni su shell.
- Las variantes nuevas se usan principalmente en la capa publica y no rompen el output actual del CMS.

### Validacion hecha

- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Siguiente paso recomendado

- Revisar visualmente tambien `/agenda` para decidir si conviene llevar el mismo refinado editorial a ese listado en una pasada corta y contenida, ahora que la base publica ya esta preparada.

---

## Festapp handoff 2026-03-20 Soporte real de imagenes v1

### Hecho

- Se ha creado la migracion `supabase/migrations/20260320110000_add_media_assets_and_cover_images.sql`.
- La base minima de media queda asi:
  - bucket publico `media` en Supabase Storage
  - tabla relacional `media_assets`
  - FK `cover_media_id` en `festivals`, `editions` y `events`
- La estructura de almacenamiento queda organizada por entidad:
  - `festivals/<festivalId>/cover/<mediaId>.<ext>`
  - `editions/<editionId>/cover/<mediaId>.<ext>`
  - `events/<eventId>/cover/<mediaId>.<ext>`
- Se han anadido policies minimas para:
  - lectura publica de `media_assets`
  - gestion de `media_assets` por usuarios internos
  - lectura publica de objetos del bucket `media`
  - upload/update/delete de objetos del bucket `media` por usuarios internos
- Existe ya una capa compartida de media en:
  - `lib/media/utils.ts`
  - `lib/media/server.ts`
- El CMS soporta portada en alta/edicion de:
  - festival
  - edicion
  - acto
- El patron UX de CMS ya incluye:
  - preview actual
  - preview local antes de guardar
  - upload
  - reemplazo
  - eliminacion
  - ayuda breve de formatos y peso
  - estado pending durante guardado
  - error visible si falla validacion o almacenamiento
- La app publica consume imagen real donde toca:
  - `/` usa portada de festival en la home global
  - `/:festivalSlug/:editionSlug` usa portada propia de la edicion
  - `/:festivalSlug/:editionSlug/actos/:eventSlug` usa portada propia del acto
  - las cards de cambios/proximo acto en home de edicion ya aprovechan portada de acto si existe
- Si falta imagen, el layout no se rompe:
  - se mantiene el bloque editorial con fallback visual reutilizable
  - no aparecen huecos vacios ni cajas rotas
- `next.config.ts` ya permite servir imagenes remotas desde Supabase Storage.
- Validacion completada:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`

### Pendiente inmediato

- Aplicar la migracion nueva en el proyecto Supabase real antes de usar el flujo en entorno compartido.
- Hacer smoke visual real con contenidos e imagenes subidas desde CMS.

### Riesgos abiertos o fase 2

- La herencia `edicion -> festival` no se ha activado todavia; hoy una edicion sin portada usa fallback visual.
- No existe todavia limpieza automatica de assets huerfanos cuando se elimina una entidad completa.
- No hay transformaciones, resize, crop ni derivados responsive.
- No hay media library, galeria ni reutilizacion de assets entre entidades.

### Siguiente paso recomendado

- Aplicar la migracion en Supabase real y hacer una pasada corta de QA visual en CMS y front publico con imagenes reales antes de abrir una fase 2 de herencia o limpieza automatica.

---

## Festapp handoff 2026-03-21 Validacion real de cierre fase 1 de imagenes

### Validacion real hecha

- Se ha comprobado el estado remoto usando `SUPABASE_SERVICE_ROLE_KEY` del entorno local, sin tocar contenido editorial.
- El proyecto real sigue sin tener aplicada la fase 1 completa de imagenes:
  - `cover_media_id` no existe aun en `festivals`
  - `cover_media_id` no existe aun en `editions`
  - `cover_media_id` no existe aun en `events`
  - el bucket `media` no existe aun
  - por tanto los joins `cover_media -> media_assets` fallan hoy en remoto si no hay fallback
- El intento de aplicar por CLI no ha podido completarse desde esta maquina por bloqueo operativo real:
  - `npx supabase migration list` falla por ausencia de `SUPABASE_ACCESS_TOKEN`
  - `npx supabase db push --db-url <pooler-url>` falla por autenticacion invalida del password contenido ahi

### Ajustes menores aplicados

- La migracion `supabase/migrations/20260320110000_add_media_assets_and_cover_images.sql` ahora es mucho mas segura para rollout:
  - `create table if not exists`
  - `add column if not exists`
  - `create index if not exists`
  - policies creadas solo si faltan
  - bucket `media` con `upsert`
- Los selects de `cover_media` ya usan hints explicitos de FK para no depender de inferencia implicita:
  - `festivals_cover_media_id_fkey`
  - `editions_cover_media_id_fkey`
  - `events_cover_media_id_fkey`
- Las queries publicas siguen funcionando aunque el entorno remoto aun no tenga la migracion completa:
  - hacen fallback a selects sin media si detectan schema incompleto
- El CMS tambien gana fallback de lectura en selects criticos para no romperse por la ausencia temporal de relaciones de media durante el rollout.
- La capa de media devuelve mensajes de error mas accionables cuando faltan `media_assets` o el bucket `media`.

### Estado despues de esta pasada

- `npm run typecheck` pasa
- `npm run lint` pasa
- `npm run build` pasa
- La fase 1 queda lista para probar en cuanto se aplique correctamente la migracion en Supabase real.

### Siguiente paso recomendado

- Obtener acceso valido de CLI o password correcto de base de datos, aplicar la migracion de imagenes en remoto y ejecutar el smoke test manual de CMS + app publica con imagenes reales.
