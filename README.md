# Festapp

Base inicial de Festapp v1 enfocada en arrancar el producto con orden, sin sobreingenieria y con el terreno preparado para construir por fases.

## Incluye en esta fase

- scaffold de Next.js App Router con TypeScript y Tailwind
- app shell publica y app shell de CMS
- rutas minimas placeholder para catalogo y backoffice
- esquema SQL inicial para Supabase
- documentacion de arquitectura y plan por fases

## No incluye todavia

- CRUD real de CMS
- autenticacion Supabase operativa
- consultas reales a base de datos
- push, IA o importaciones
- favoritos persistidos en navegador

## Arranque local

```bash
npm install
npm run dev
```

Completa antes `.env.local` a partir de `.env.example` cuando se conecte Supabase.
