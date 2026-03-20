# Festapp

Base inicial de Festapp v1 enfocada en arrancar el producto con orden, sin sobreingenieria y con el terreno preparado para construir por fases.

## Incluye en esta fase

- scaffold de Next.js App Router con TypeScript y Tailwind
- app shell publica y app shell de CMS
- rutas publicas placeholder para catalogo
- login, logout y proteccion base del CMS
- consultas minimas reales del CMS a Supabase
- esquema SQL inicial para Supabase
- documentacion de arquitectura, plan por fases y validacion real

## No incluye todavia

- CRUD real de CMS
- push, IA o importaciones
- favoritos persistidos en navegador
- catalogo publico completo

## Arranque local

```bash
npm install
npm run dev
```

Completa antes `.env.local` a partir de `.env.example` cuando se conecte Supabase.

## Validacion real del CMS

La guia operativa para conectar Supabase real, aplicar migraciones y crear usuarios internos de prueba esta en:

- `docs/implementation/phase-1-5-real-validation.md`
