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
