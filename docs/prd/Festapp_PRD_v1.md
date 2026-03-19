# PRD — Festapp v1

## 1. Resumen ejecutivo

Festapp es una **web app mobile-first** para consultar fiestas y actos de forma rápida, clara y fiable desde el móvil. Su objetivo es resolver una necesidad muy concreta: durante unas fiestas la información existe, pero suele estar dispersa entre PDFs, redes sociales, carteles, mensajes y cambios de última hora. Eso hace difícil saber **qué acto hay, cuándo es, dónde es y si ha cambiado**.

La v1 debe demostrar utilidad inmediata: que un usuario encuentre la información correcta en menos de 30 segundos y que el equipo que gestiona el contenido pueda mantenerla sin depender de desarrollo. El producto será **multi-fiesta**, con soporte por **ediciones**, un **CMS básico**, fuentes de datos mixtas y una base preparada para evolución futura con IA. El foco principal no es editorial ni decorativo: es una herramienta operativa de consulta real durante fiestas.

---

## 2. Problema y objetivo

### Problema

Durante fiestas y eventos locales, la información relevante para el usuario suele estar:

- fragmentada en múltiples canales,
- mal adaptada a móvil,
- poco estructurada para consulta rápida,
- sujeta a cambios de última hora,
- difícil de mantener al día por parte del equipo organizador.

Esto genera pérdida de tiempo, errores, dependencia de terceros y baja confianza en la información publicada.

### Objetivo de producto

Permitir que cualquier usuario encuentre **qué acto hay, dónde es y a qué hora empieza** en **menos de 30 segundos**, desde el móvil y con información fiable.

### Objetivos medibles de v1

1. El 80% de usuarios de prueba debe poder encontrar un acto concreto en menos de 30 segundos.
2. El 90% de actos publicados debe mostrar al menos: nombre, fecha, hora, lugar y estado.
3. El 100% de cambios críticos publicados desde CMS debe reflejarse en la app pública en menos de 2 minutos.
4. El equipo de contenido debe poder crear o editar un acto sin tocar código.
5. La home y la agenda deben cargar contenido útil principal en menos de 2.5 segundos en móvil bajo condiciones normales.

---

## 3. Público objetivo y casos de uso principales

### Público objetivo

- asistentes generales a fiestas,
- festeros y miembros de comparsas/filàs,
- familiares o acompañantes,
- público ocasional,
- equipo interno que gestiona contenido.

### Casos de uso principales

1. Consultar qué actos hay ahora, hoy o próximamente.
2. Ver detalle de un acto con hora, descripción y mapa.
3. Buscar un acto por nombre o texto.
4. Filtrar por fecha, categoría o comparsa/filà.
5. Ver alertas y cambios importantes.
6. Guardar actos en favoritos.
7. Compartir un acto.
8. Gestionar actos, ubicaciones y alertas desde un CMS simple.
9. Importar información desde varias fuentes.
10. Usar IA como ayuda editorial dentro del CMS.

---

## 4. Alcance (IN / OUT) + supuestos

### IN

- Web app **mobile-first**
- Soporte para **múltiples fiestas**
- Soporte para **múltiples ediciones** por fiesta
- Home con bloques “Ahora”, “Hoy” y “Próximos”
- Agenda/listado de actos
- Detalle de acto
- Búsqueda por texto
- Filtros por fecha, categoría y comparsa/filà
- Favoritos
- Compartir acto
- Mapa desde el primer día
- Sección de alertas
- Push notifications globales por edición
- CMS básico con roles simples
- Carga e importación desde varias fuentes mezcladas
- Flujo asistido para PDF
- Histórico público de actos finalizados
- Idioma único: castellano en v1
- Capa preparada para integraciones IA futuras
- IA asistiva en CMS con revisión humana

### OUT

- App nativa iOS/Android en v1
- Red social, comentarios o chat público en v1
- Gamificación
- Compra de entradas, pagos o reservas
- Moderación editorial compleja
- Permisos avanzados y flujos de aprobación multi-etapa
- Recomendador en producción en v1
- Chatbot público en v1
- Publicación totalmente automática de contenido generado por IA
- Mapa avanzado con routing propio

### Supuestos

1. La prioridad de v1 es la **consulta rápida y fiable**.
2. El usuario final no necesita login obligatorio.
3. El equipo interno sí tendrá acceso autenticado al CMS.
4. Los favoritos en v1 podrán persistirse localmente en el dispositivo.
5. El push será opcional y nunca será el único canal de alertas.
6. Todo acto pertenecerá a una fiesta y a una edición concretas.
7. El contenido complementario en v1 será mínimo y práctico, no editorial extenso.
8. La IA en v1 será **asistiva y supervisada**, no autónoma en publicación.

---

## 5. Historias de usuario

| Como | Quiero | Para |
|---|---|---|
| asistente | ver qué actos hay ahora | decidir rápido a dónde ir |
| asistente | ver los actos de hoy y próximos | organizar mi tiempo |
| asistente | buscar un acto por nombre | encontrarlo sin navegar demasiado |
| asistente | filtrar por fecha o categoría | reducir ruido |
| festero | ver actos de una comparsa/filà | seguir lo que me interesa |
| asistente | abrir un acto y ver su mapa | llegar al sitio correcto |
| asistente | ver si un acto ha cambiado o se ha cancelado | evitar errores |
| asistente | guardar favoritos | recuperar actos importantes |
| asistente | compartir un acto | reenviarlo a otras personas |
| editor | crear y editar actos | mantener la información al día |
| editor | publicar alertas | comunicar cambios urgentes |
| admin | gestionar fiestas, ediciones y usuarios internos | operar el sistema sin depender de desarrollo |
| editor | usar ayuda de IA para completar datos | ahorrar tiempo de edición |
| admin | revisar trazabilidad de origen del contenido | mantener control y calidad |

---

## 6. Flujo del usuario

### Flujo público

1. El usuario abre Festapp.
2. Ve una home con acceso rápido a “Ahora”, “Hoy”, “Próximos” y alertas activas.
3. Selecciona una fiesta o edición si hay varias disponibles.
4. Explora agenda o usa búsqueda y filtros.
5. Entra en el detalle de un acto.
6. Consulta hora, estado, descripción, comparsa/filà y ubicación.
7. Abre el mapa.
8. Puede guardar el acto en favoritos o compartirlo.
9. Si hay cambios, los ve reflejados en alertas y/o en el propio acto.
10. Si ha aceptado push, puede recibir avisos globales de la edición.

### Flujo interno (CMS)

1. Usuario interno inicia sesión.
2. Selecciona fiesta y edición.
3. Crea, edita o importa actos.
4. Gestiona ubicaciones, categorías y comparsas/filàs.
5. Publica alertas.
6. Revisa vista previa y estado.
7. Publica cambios.
8. El sistema registra trazabilidad y auditoría.
9. Opcionalmente usa IA para extraer, completar o proponer contenido antes de publicar.

---

## 7. Requisitos funcionales

### Catálogo público

**RF-01.** El sistema debe permitir navegar entre múltiples fiestas.  
**Criterio de aceptación:** el usuario puede cambiar de fiesta y solo ve el contenido asociado a esa fiesta.

**RF-02.** El sistema debe soportar múltiples ediciones por fiesta.  
**Criterio de aceptación:** el contenido queda claramente segmentado por edición y puede consultarse sin mezclar actos de ediciones distintas.

**RF-03.** La home debe mostrar bloques de “Ahora”, “Hoy” y “Próximos”.  
**Criterio de aceptación:** cada bloque muestra actos correctos según fecha y hora de la edición activa.

**RF-04.** El usuario debe poder consultar una agenda completa de actos ordenada por fecha y hora.  
**Criterio de aceptación:** la agenda se ordena correctamente y permite navegación fluida en móvil.

**RF-05.** El usuario debe poder buscar actos por texto.  
**Criterio de aceptación:** la búsqueda encuentra coincidencias por nombre y descripción breve.

**RF-06.** El usuario debe poder filtrar por fecha, categoría y comparsa/filà.  
**Criterio de aceptación:** los filtros pueden combinarse y actualizan resultados correctamente.

**RF-07.** Cada acto debe tener una ficha de detalle.  
**Criterio de aceptación:** la ficha muestra mínimo nombre, fecha, hora, lugar, estado, descripción breve y mapa.

**RF-08.** Cada acto debe mostrar su estado operativo.  
**Estados mínimos:** programado, actualizado, cancelado, finalizado.  
**Criterio de aceptación:** el estado es visible en listado y detalle.

**RF-09.** El sistema debe mostrar una sección de alertas.  
**Criterio de aceptación:** las alertas activas aparecen destacadas en home y en una vista específica.

**RF-10.** Un acto con cambio relevante debe reflejarlo visualmente.  
**Criterio de aceptación:** si cambia hora, lugar o estado, el acto muestra sello o indicación de actualización.

**RF-11.** El usuario debe poder guardar favoritos.  
**Criterio de aceptación:** puede marcar y desmarcar actos y ver una lista de favoritos.

**RF-12.** El usuario debe poder compartir un acto.  
**Criterio de aceptación:** desde móvil se abre compartir nativo si existe; si no, se copia el enlace.

**RF-13.** Cada acto debe ofrecer acceso a mapa desde el primer día.  
**Criterio de aceptación:** si hay ubicación válida, el usuario puede abrir Google Maps.

**RF-14.** El sistema debe permitir consultar actos finalizados en histórico dentro de una edición activa.  
**Criterio de aceptación:** los actos finalizados siguen accesibles y claramente marcados como finalizados.

### CMS / Backoffice

**RF-15.** El CMS debe permitir crear, editar, despublicar y eliminar actos.  
**Criterio de aceptación:** un editor autenticado puede ejecutar estas acciones según permisos.

**RF-16.** El CMS debe permitir gestionar ubicaciones reutilizables.  
**Criterio de aceptación:** el usuario interno puede crear una ubicación con nombre, dirección y coordenadas opcionales.

**RF-17.** El CMS debe permitir gestionar categorías y comparsas/filàs.  
**Criterio de aceptación:** estas entidades se pueden crear, editar y asociar a actos.

**RF-18.** El CMS debe permitir publicar alertas generales y ligadas a actos.  
**Criterio de aceptación:** una alerta puede tener título, mensaje, prioridad, vigencia y acto opcional.

**RF-19.** El sistema debe permitir importar datos desde varias fuentes mezcladas.  
**Criterio de aceptación:** el CMS admite al menos carga manual, CSV/Excel y flujo asistido de PDF.

**RF-20.** Toda importación debe pasar por revisión antes de publicar si existen dudas o conflictos.  
**Criterio de aceptación:** registros ambiguos o incompletos quedan en estado borrador o revisar.

**RF-21.** El sistema debe registrar trazabilidad básica de cambios.  
**Criterio de aceptación:** cada cambio deja registro de usuario, fecha y acción.

### Push y alertas

**RF-22.** El sistema debe permitir suscripción voluntaria a notificaciones push.  
**Criterio de aceptación:** el usuario puede aceptar o rechazar el permiso sin bloquear el uso de la app.

**RF-23.** El sistema debe permitir enviar push globales por edición.  
**Criterio de aceptación:** un admin puede lanzar un aviso push ligado a una alerta publicada de la edición activa.

**RF-24.** Toda alerta enviada por push debe existir también dentro de la app.  
**Criterio de aceptación:** el usuario puede verla aunque no tenga push activado.

### IA y extensibilidad

**RF-25.** El CMS debe poder usar IA para extraer contenido desde PDF o texto pegado.  
**Criterio de aceptación:** el sistema genera candidatos a actos o campos sugeridos para revisión.

**RF-26.** El CMS debe poder usar IA para proponer título, resumen, categoría, ubicación o mejoras de redacción.  
**Criterio de aceptación:** cada sugerencia queda marcada como sugerencia y requiere validación humana.

**RF-27.** Ningún contenido generado o completado por IA debe publicarse automáticamente en v1.  
**Criterio de aceptación:** publicar requiere acción explícita de editor o admin.

**RF-28.** El sistema debe guardar el origen de los datos relevantes.  
**Criterio de aceptación:** un editor puede ver si un dato vino de carga manual, CSV/Excel, PDF, scraping asistido o IA.

**RF-29.** La arquitectura debe contemplar una capa desacoplada para futuras funciones IA públicas.  
**Criterio de aceptación:** el backend expone puntos de integración para recomendador, búsqueda semántica o chatbot sin rehacer el modelo principal.

---

## 8. Reglas de negocio (incluye edge cases)

1. Todo acto debe pertenecer a una fiesta y a una edición.
2. Un acto no puede publicarse sin nombre, fecha, hora y ubicación o indicación explícita de ubicación pendiente.
3. Si un acto cambia de hora o lugar tras publicarse, debe actualizarse su fecha de modificación y mostrarse visualmente.
4. Si un acto se cancela, no se elimina por defecto: cambia a estado `cancelado`.
5. Las alertas pueden ser globales de edición o vinculadas a un acto concreto.
6. Una alerta caducada deja de ser visible públicamente, pero permanece registrada internamente.
7. Los actos finalizados pueden seguir siendo visibles en histórico mientras la edición esté activa.
8. Si una fuente importada trae datos ambiguos o incompletos, el registro no se publica automáticamente.
9. Si varias fuentes aportan datos conflictivos del mismo acto, prevalece la última versión validada por un editor.
10. Los favoritos del usuario sin cuenta se guardan localmente y pueden perderse si borra datos del navegador.
11. Si una ubicación no tiene coordenadas, debe seguir mostrándose nombre y dirección.
12. El push no debe utilizarse para cambios menores sin impacto real.
13. Un editor no puede gestionar usuarios ni permisos.
14. Si el dispositivo o navegador no soporta push, la app debe seguir siendo totalmente funcional.
15. La IA puede asistir en extracción, clasificación, completado y redacción, pero no publicar por sí sola en v1.
16. Todo contenido asistido por IA debe quedar marcado y trazable.
17. Si una sugerencia IA tiene baja confianza o faltan campos críticos, el registro queda en `borrador_revisar`.
18. El scraping asistido nunca debe sobrescribir directamente contenido ya validado sin revisión humana.
19. Un futuro chatbot solo podrá responder con información publicada o aprobada.
20. Un futuro recomendador no podrá sustituir la navegación principal ni ocultar agenda completa.

---

## 9. Datos y entidades

| Entidad | Campos principales | Validaciones |
|---|---|---|
| Fiesta | id, nombre, slug, descripción corta, ciudad, estado | nombre y slug obligatorios; slug único |
| Edición | id, fiesta_id, nombre, año, fecha_inicio, fecha_fin, timezone, estado | rango válido; vinculada a una fiesta |
| Acto | id, edicion_id, titulo, slug, descripcion_breve, descripcion, fecha, hora_inicio, hora_fin, categoria_id, ubicacion_id, comparsa_id opcional, estado, destacado, source_type, source_ref, source_confidence, review_status, ai_assisted, published_at, updated_at | título, fecha, hora_inicio y edición obligatorios |
| Ubicación | id, nombre, dirección, latitud, longitud, notas_acceso, mapa_url | nombre obligatorio |
| Categoría | id, nombre, slug, orden | nombre y slug válidos |
| Comparsa/Filà | id, nombre, slug, descripción opcional | nombre obligatorio |
| Alerta | id, edicion_id, acto_id opcional, titulo, mensaje, prioridad, tipo, activa, visible_desde, visible_hasta, enviar_push, suggested_by_ai, approved_by, created_by | título, mensaje y prioridad obligatorios |
| Favorito | id, user_key o dispositivo, acto_id, created_at | un favorito por acto y dispositivo |
| Usuario interno | id, nombre, email, password_hash o proveedor_auth, rol, activo, last_login | email único; rol obligatorio |
| Import Job | id, edicion_id, fuente, tipo_fichero, estado, resumen, errores, created_by, created_at | estado obligatorio |
| Audit Log | id, usuario_id, entidad, entidad_id, acción, diff_resumido, created_at | no editable |
| Source Record | id, tipo_fuente, referencia, fichero_url o hash, fecha_ingesta, notas | tipo obligatorio |
| Content Provenance | id, entidad, entidad_id, campo, valor_origen, source_record_id, generado_por_ia, validado_por, validated_at | obligatorio para campos asistidos |
| AI Job | id, tipo, origen, input_ref, estado, resultado_resumen, confianza, created_by, created_at | tipo y estado obligatorios |

---

## 10. Pantallas / Componentes

### 10.1 Home
- **Objetivo:** resolver rápido qué hay ahora, hoy y próximamente.
- **Inputs:** fiesta/edición activa, hora actual, alertas activas.
- **Outputs:** bloques de actos y acceso a agenda.
- **Estados:** loading, vacío, error, con alertas, sin alertas.

### 10.2 Selector de fiesta/edición
- **Objetivo:** cambiar de contexto.
- **Inputs:** lista de fiestas y ediciones.
- **Outputs:** contexto activo.
- **Estados:** una fiesta, varias fiestas, sin contenido.

### 10.3 Agenda / Listado
- **Objetivo:** explorar el programa completo.
- **Inputs:** búsqueda, filtros, orden.
- **Outputs:** listado de actos.
- **Estados:** loading, sin resultados, error.

### 10.4 Detalle de acto
- **Objetivo:** ver ficha operativa de un acto.
- **Inputs:** id o slug del acto.
- **Outputs:** hora, estado, descripción, comparsa/filà, ubicación, mapa, compartir, favorito.
- **Estados:** normal, actualizado, cancelado, finalizado, sin coordenadas.

### 10.5 Alertas
- **Objetivo:** ver avisos importantes.
- **Inputs:** edición activa.
- **Outputs:** listado de alertas vigentes.
- **Estados:** sin alertas, alertas activas, error.

### 10.6 Favoritos
- **Objetivo:** reunir actos guardados.
- **Inputs:** favoritos del dispositivo.
- **Outputs:** lista de actos favoritos.
- **Estados:** vacío, con elementos.

### 10.7 Histórico
- **Objetivo:** consultar actos finalizados.
- **Inputs:** edición activa, filtros.
- **Outputs:** listado de actos finalizados.
- **Estados:** vacío, con histórico.

### 10.8 CMS — Dashboard
- **Objetivo:** visión rápida del estado de la edición.
- **Inputs:** sesión interna y edición activa.
- **Outputs:** accesos y métricas básicas.

### 10.9 CMS — Gestión de actos
- **Objetivo:** crear, editar, buscar e importar actos.
- **Inputs:** formularios, ficheros y acciones de revisión.
- **Outputs:** actos en borrador o publicados.
- **Estados:** borrador, revisar, publicado, cancelado, error.

### 10.10 CMS — Gestión de ubicaciones / categorías / comparsas
- **Objetivo:** mantener entidades reutilizables.
- **Inputs:** formularios CRUD.
- **Outputs:** entidades disponibles para los actos.

### 10.11 CMS — Gestión de alertas
- **Objetivo:** crear alertas visibles y opcionalmente enviables por push.
- **Inputs:** título, mensaje, prioridad, vigencia, acto opcional.
- **Outputs:** alerta publicada.
- **Estados:** borrador, activa, expirada, enviada.

### 10.12 CMS — Importación
- **Objetivo:** cargar datos desde CSV, Excel o PDF asistido.
- **Inputs:** fichero o contenido fuente.
- **Outputs:** preview, errores, sugerencias y registros preparados para revisión.
- **Estados:** pendiente, procesando, con errores, completado.

### 10.13 CMS — Asistencia IA
- **Objetivo:** ayudar a completar, limpiar o proponer contenido.
- **Inputs:** texto, PDF, borradores, fuentes externas.
- **Outputs:** campos sugeridos, resúmenes, categorías o alertas propuestas.
- **Estados:** generado, baja confianza, revisado, aprobado, descartado.

---

## 11. Integraciones

### 11.1 Google Maps
- Uso para abrir la ubicación del acto.
- V1 con integración simple mediante enlace directo.
- Si no hay coordenadas, se muestra nombre y dirección.

### 11.2 Push notifications
- Uso para avisos globales por edición.
- Deben estar ligados a alertas reales dentro de la app.
- Deben funcionar como canal complementario, no único.

### 11.3 Ingesta de datos
- Entrada manual.
- CSV / Excel.
- Flujo asistido desde PDF.
- Posible scraping asistido con revisión humana.

### 11.4 Analítica
Eventos mínimos:
- page_view
- search_used
- filter_used
- acto_view
- favorite_add
- share_click
- alert_view
- push_opt_in
- push_open
- import_started
- import_reviewed
- ai_suggestion_generated
- ai_suggestion_accepted

### 11.5 Autenticación interna
- Acceso al CMS con email + contraseña o magic link.
- No aplica al usuario público en v1.

### 11.6 Capa de servicios IA
- Extracción desde PDF.
- Normalización de contenido.
- Propuesta de títulos, resúmenes, categorías y alertas.
- Base preparada para chatbot, recomendador y búsqueda semántica futura.
- Debe existir una capa desacoplada de proveedor para no atar el producto a una sola solución.

---

## 12. Autenticación y permisos

### Usuario final
- Sin login obligatorio en v1.
- Acceso libre a contenido público.
- Favoritos locales.

### Roles internos

#### Admin
- Gestionar usuarios internos
- Gestionar fiestas y ediciones
- CRUD completo de actos, ubicaciones, categorías, comparsas/filàs y alertas
- Lanzar importaciones
- Revisar auditoría
- Gestionar herramientas IA internas

#### Editor
- CRUD de actos, ubicaciones, categorías, comparsas/filàs y alertas
- Ejecutar importaciones
- Usar ayuda IA para completar contenido
- No puede gestionar usuarios ni permisos

### Sesiones
- Sesión segura
- Expiración controlada
- Cierre de sesión
- Revocación por admin si es necesario

---

## 13. Seguridad y privacidad

### Seguridad

- Gestión segura de sesiones o tokens
- Protección contra inyección en búsqueda, formularios e importaciones
- Permisos por rol en todas las rutas privadas
- Rate limiting en login, búsqueda, push e importación
- Manejo de secretos fuera del repositorio
- Backups y plan de recuperación
- Logs de seguridad y auditoría
- Validación server-side
- Sanitización de contenido enriquecido si existe
- HTTPS obligatorio
- Protección de endpoints de IA y control de abuso

### Privacidad

- Qué datos se guardan:
  - contenido de fiestas y actos,
  - usuarios internos,
  - logs técnicos,
  - auditoría,
  - suscripciones push,
  - favoritos locales del usuario final.

- Retención:
  - logs y auditoría mínimo 12 meses,
  - suscripciones push hasta baja o caducidad,
  - usuarios internos mientras exista cuenta activa.

- Consentimiento:
  - consentimiento explícito para push,
  - consentimiento para analítica según implementación legal final.

- Minimización:
  - no pedir datos personales al usuario público salvo necesidad futura.

### IA

- Todo contenido asistido por IA debe quedar marcado
- No se publica automáticamente en v1
- Debe poder desactivarse la integración IA sin romper el CMS
- Debe limitarse el envío de datos sensibles a servicios externos
- Deben guardarse logs operativos mínimos para trazabilidad
- El scraping o uso de fuentes externas debe revisarse antes de automatizarlo

### Login

- Recuperación de contraseña o magic link para usuarios internos
- Verificación de email para altas internas
- Bloqueo temporal tras varios intentos fallidos

---

## 14. Performance y escalabilidad

### Objetivos

- Home y agenda: contenido principal usable en menos de 2.5 segundos en móvil
- Respuesta visual al aplicar filtros: menos de 500 ms en escenario normal
- Apertura de detalle: menos de 1.5 segundos desde navegación interna
- Reflejo público de cambios desde CMS: menos de 2 minutos

### Límites iniciales

- Preparado para múltiples fiestas y múltiples ediciones
- Escala de miles de actos por edición sin degradación perceptible para el usuario

### Estrategias

- Caché de listados públicos
- Índices por fiesta, edición, fecha, categoría y slug
- Carga diferida de mapas
- Optimización de assets
- Service worker para experiencia app y mejora de rendimiento
- Degradación elegante si no hay push o PWA instalada

---

## 15. Observabilidad

### Logs

- login / logout
- errores de permisos
- cambios de actos y alertas
- errores de importación
- envíos push y fallos
- uso y errores de herramientas IA
- errores críticos de cliente y servidor

### Métricas

- usuarios activos por fiesta/edición
- búsquedas por sesión
- tiempo hasta encontrar un acto
- aperturas de detalle
- ratio de uso de filtros
- favoritos añadidos
- shares
- visualizaciones de alertas
- opt-in y apertura de push
- porcentaje de sugerencias IA aceptadas
- coste y latencia de tareas IA
- errores por 1.000 sesiones

### Alertas operativas

- caída del CMS
- caída de frontend público
- fallo masivo de importación
- aumento de errores 5xx
- fallo del proveedor push
- fallo del proveedor IA

---

## 16. QA: criterios de aceptación + casos de prueba

### Criterios de aceptación globales

1. Un usuario nuevo entiende dónde mirar en menos de 10 segundos.
2. Un usuario puede encontrar un acto concreto en menos de 30 segundos.
3. Un editor puede crear o editar un acto en pocos minutos sin tocar código.
4. Una alerta crítica aparece en la app sin despliegue técnico.
5. La app sigue siendo usable aunque push no esté disponible.
6. Ninguna sugerencia IA se publica automáticamente.

### Casos de prueba clave

1. Crear fiesta, edición y actos; verificar visibilidad pública correcta.
2. Buscar por nombre parcial; comprobar coincidencias.
3. Filtrar por fecha, categoría y comparsa/filà; comprobar resultados correctos.
4. Abrir detalle de acto y acceder a mapa.
5. Marcar y desmarcar favorito; comprobar persistencia local.
6. Compartir acto desde móvil.
7. Crear alerta global; comprobar home y sección de alertas.
8. Cancelar un acto; comprobar estado en lista y detalle.
9. Consultar histórico de actos finalizados.
10. Importar CSV/Excel con errores; comprobar que no publica registros inválidos.
11. Importar PDF asistido; comprobar que genera sugerencias para revisión.
12. Editor intenta gestionar usuarios; debe fallar por permisos.
13. Usuario rechaza push; la app sigue operativa.
14. Navegador sin soporte de push; interfaz no debe romperse.
15. Ejecutar ayuda IA para completar un acto; comprobar trazabilidad y revisión obligatoria.

---

## 17. Plan MVP (qué entra en v1) + roadmap v2

### MVP v1

- Multi-fiesta y multi-edición
- Home con “Ahora / Hoy / Próximos”
- Agenda completa
- Detalle de acto
- Búsqueda
- Filtros por fecha, categoría y comparsa/filà
- Google Maps como mapa por defecto
- Alertas
- Favoritos locales
- Compartir acto
- Histórico de actos finalizados
- CMS básico con roles simples
- Importación manual, CSV/Excel y flujo asistido PDF
- Push global por edición
- IA interna para ayuda editorial con revisión humana
- Trazabilidad de origen del contenido

### Roadmap v2

- Login opcional de usuario final
- Favoritos sincronizados entre dispositivos
- Chatbot público
- Recomendador de actos
- Búsqueda semántica
- Segmentación avanzada de alertas
- Mejoras de scraping
- Multidioma
- Histórico avanzado por ediciones
- Personalización ligera

---

## 18. Prompt de handoff para agente de código

```md
# Contexto / Rol
Estás implementando Festapp v1, una web app mobile-first para consultar fiestas y actos de forma rápida y fiable. La prioridad es resolver en segundos qué hay, cuándo, dónde y si ha cambiado. El producto tiene frontend público y CMS interno.

# Tarea
Construye la base funcional de Festapp v1 con:
1. soporte multi-fiesta y multi-edición
2. home con bloques Ahora / Hoy / Próximos
3. agenda pública con búsqueda y filtros
4. detalle de acto con mapa, favorito y compartir
5. sección de alertas
6. histórico público de actos finalizados
7. CMS con roles admin y editor
8. importación manual, CSV/Excel y PDF asistido
9. soporte push global por edición
10. capa de asistencia IA para CMS con revisión humana
11. trazabilidad de origen de contenido

# Restricciones
- Mobile-first real
- Usuario público sin login obligatorio
- CMS solo para usuarios internos autenticados
- Idioma único en v1: castellano
- Google Maps como proveedor por defecto
- Push nunca puede ser el único canal de alertas
- IA no puede publicar automáticamente en v1
- No incluir social, chat público, gamificación, pagos ni permisos complejos

# Modelo de datos mínimo
Fiesta, Edición, Acto, Ubicación, Categoría, Comparsa/Filà, Alerta, Usuario interno, Favorito, Import Job, Audit Log, Source Record, Content Provenance, AI Job.

# Criterios de calidad
- código claro, modular y mantenible
- validación frontend y backend
- permisos por rol
- estados vacíos, error y loading bien resueltos
- rendimiento bueno en móvil
- trazabilidad de cambios y origen de datos
- arquitectura preparada para añadir recomendador, chatbot o búsqueda semántica en futuro

# Qué debes devolver
1. propuesta de arquitectura
2. modelo de datos
3. pantallas y rutas
4. endpoints o server actions
5. plan de implementación por fases
6. estructura de carpetas
7. riesgos técnicos y mitigaciones
8. tests mínimos

# Verificación
Comprueba:
- que un usuario puede encontrar un acto y abrir su detalle
- que búsqueda y filtros funcionan
- que un editor puede crear, editar y publicar actos y alertas
- que el histórico muestra actos finalizados
- que el flujo de importación PDF asistido no publica sin revisión
- que los permisos admin/editor se respetan
- que el sistema degrada bien sin push
- que la capa IA es asistiva y trazable
```

---

## Decisiones asumidas

1. Festapp v1 se implementará como web app mobile-first con base preparada para experiencia tipo app.
2. Los favoritos se guardarán localmente en v1.
3. El proveedor de mapas por defecto será Google Maps.
4. El push será global por edición.
5. El histórico de actos finalizados será visible públicamente.
6. La importación incluirá flujo asistido también para PDF.
7. La IA en v1 será interna para CMS y con revisión humana obligatoria.
8. El contenido complementario será mínimo y práctico, no una capa editorial extensa.

---

## Preguntas abiertas

1. ¿Qué nivel de detalle debe tener el contenido complementario práctico en home o fichas?
2. ¿La IA del CMS debe poder proponer también imágenes o solo texto y estructura?
3. ¿Quieres que exista una prioridad visual especial para actos destacados en home y agenda?
4. ¿El histórico debe tener filtros propios o basta con integrarlo dentro de agenda?
5. ¿La edición activa debe decidirse manualmente desde CMS o automáticamente por fechas?

---

## Siguiente paso recomendado

Definir ahora el **modelo técnico y el esquema real de base de datos**, porque eso deja la PRD lista para pasar a construcción con muy poca ambigüedad.
