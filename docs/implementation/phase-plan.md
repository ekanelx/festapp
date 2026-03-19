# Festapp v1 - Plan de implementacion por fases

## Fase 0 - Fundacion tecnica

- scaffold de Next.js, TypeScript y Tailwind
- rutas publicas y privadas placeholder
- esquema relacional inicial en Supabase
- documentacion de arquitectura y plan

## Fase 1 - Datos y auth base

- conectar proyecto a Supabase
- montar clientes server/browser
- crear login interno
- proteger `/cms`
- alta inicial de `admin` e `editor`
- consultas reales para fiestas, ediciones y actos publicados

## Fase 2 - Catalogo publico

- home de edicion con bloques Ahora / Hoy / Proximos
- agenda con busqueda y filtros en URL
- detalle de acto con estado visible y salida a Google Maps
- alertas publicas
- historico de finalizados
- loading, empty y error states reales

## Fase 3 - CMS basico

- listados y formularios para actos
- CRUD de ubicaciones, categorias y comparsas o filàs
- CRUD de alertas
- cambios de estado editorial
- trazabilidad minima visible en CMS

## Fase 4 - Operacion y calidad

- revalidacion y estrategia de cache
- analitica minima
- pruebas de rutas criticas
- endurecimiento de RLS y validaciones server-side

## Fase 5 - Extensiones diferidas

- importacion manual y CSV o Excel
- flujo asistido desde PDF
- push global por edicion
- ayuda editorial con IA y revision humana

## Orden recomendado

1. Conectar Supabase y auth interna.
2. Implementar el catalogo publico completo.
3. Construir el CMS basico sobre el mismo dominio y schema.
4. Endurecer calidad y observabilidad.
5. Abrir extensiones como importacion, push e IA.
