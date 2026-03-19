# DECISIONS_LOG.md

## Objetivo

Este documento registra decisiones estables de trabajo dentro de mi sistema de vibecoding.

No sirve para guardar cualquier idea.
Sirve para evitar reabrir debates ya resueltos, conservar criterio operativo y mantener continuidad entre proyectos.

---

## Qué debe entrar aquí

Registrar solo decisiones que cumplan al menos una de estas condiciones:

- afectan a varios proyectos
- cambian cómo trabajo con agentes
- establecen una regla operativa reusable
- evitan repetir un error frecuente
- fijan una preferencia justificada entre varias opciones
- modifican estructura, flujo o documentación del sistema

---

## Qué no debe entrar aquí

No registrar:

- pensamientos provisionales
- pruebas sin conclusión
- intuiciones no validadas
- notas sueltas
- ideas que todavía no tienen impacto operativo
- debates abiertos

---

## Cómo redactar una decisión

Cada entrada debe ser:

- breve
- clara
- concreta
- útil dentro de 1 mes
- útil dentro de 6 meses

Si no se entiende rápido o no cambia cómo actúo, no merece quedar aquí.

---

## Plantilla de entrada

### [FECHA] — [TÍTULO CORTO]

**Decisión**  
Qué se decidió.

**Contexto**  
Qué problema, necesidad o dilema motivó esta decisión.

**Motivo**  
Por qué se eligió esta opción y no otra.

**Implicaciones**  
Qué cambia a partir de ahora.

**Cuándo revisarla**  
Solo si tiene sentido revisar esta decisión más adelante.

---

## Entradas

### [2026-03-17] — El Project pasa de base documental a sistema operativo

**Decisión**  
Este Project deja de usarse principalmente como espacio de análisis de documentación y pasa a usarse como sistema operativo de trabajo para vibecoding.

**Contexto**  
La base de conocimiento ya cubre suficientemente prompting, agentes, Codex, Gemini y Claude para empezar a operar. El siguiente cuello de botella no es falta de información, sino falta de estructura operativa reusable.

**Motivo**  
Seguir acumulando análisis aporta poco retorno. Crear documentos maestros, plantillas y skills aporta más valor inmediato y mejora la calidad del trabajo real.

**Implicaciones**  
A partir de ahora, la prioridad es construir y mantener:

- documentos núcleo
- plantillas
- skills
- handoffs
- reglas reutilizables

**Cuándo revisarla**  
Si el sistema deja de ser útil o se vuelve excesivamente rígido.

---

### [2026-03-17] — Orden de construcción del sistema base

**Decisión**  
El orden base de construcción será:

1. `README.md`
2. `AGENTS_STRATEGY.md`
3. `MODEL_ROUTING.md`
4. `PROMPT_PATTERNS.md`
5. `SKILLS_STRATEGY.md`
6. `02-Skills/INDEX.md`
7. `02-Skills/_adapted/debugging/SKILL.md`
8. `DECISIONS_LOG.md`

**Contexto**  
Había varias opciones sobre qué documentos crear primero. Hacía falta un orden que maximizara retorno rápido sin abrir demasiados frentes a la vez.

**Motivo**  
Ese orden prioriza documentos que gobiernan sistema, criterio y elección de herramienta antes de entrar en escalado con skills y registro de decisiones.

**Implicaciones**  
Las siguientes piezas del sistema deben construirse respetando este orden salvo que aparezca una necesidad operativa más urgente.

**Cuándo revisarla**  
Si el flujo real demuestra un orden mejor.

---

### [2026-03-17] — Estructura externa del sistema Vibecoding-OS

**Decisión**  
El sistema se guardará fuera de ChatGPT en una carpeta real llamada `Vibecoding-OS` con esta estructura mínima:

```text
/Vibecoding-OS/
  /00-Core/
  /01-Templates/
    /examples/
  /02-Skills/
```

**Contexto**  
Hacía falta sacar el sistema del chat y convertirlo en una base real, versionable y mantenible.

**Motivo**  
Trabajar sobre carpetas reales permite reorganizar, reutilizar y mantener mejor los documentos, las plantillas y las skills.

**Implicaciones**  
La documentación operativa debe alinearse con esta estructura y evitar referencias a bloques que ya no se usan como parte del sistema activo.

**Cuándo revisarla**  
Si aparece una necesidad operativa clara que justifique abrir un bloque nuevo.

---

### [2026-03-18] — Core, templates y skills se separan por función

**Decisión**  
`00-Core` se reserva para estrategia, criterio y sistema. `01-Templates` se reserva para plantillas operativas y sus ejemplos. `02-Skills` concentra el índice de skills y los workflows reutilizables.

**Contexto**  
La estructura anterior mezclaba documentos de sistema, plantillas y workflows, lo que generaba rutas y referencias inconsistentes.

**Motivo**  
Separar por función reduce ruido, mejora navegación y deja más claro qué pieza usar en cada momento.

**Implicaciones**  
A partir de ahora:

- `AGENTS_STRATEGY.md` sustituye a `AGENTS_MASTER.md`
- `README.md` sustituye a `PROJECT_INDEX.md` como entrada del core
- `02-Skills/INDEX.md` sustituye a `SKILLS_INDEX.md`
- `02-Skills/_adapted/debugging/SKILL.md` sustituye a `DEBUG_WORKFLOW.md` como workflow reusable
- los ejemplos operativos viven en `01-Templates/examples/`

**Cuándo revisarla**  
Si la separación deja de ser práctica por uso real.

---

### [2026-03-17] — Vibecoding-OS v1 cerrada

**Decisión**  
Se cierra la v1 de Vibecoding-OS con core operativo, templates base, skills mínimas e índices alineados.

**Contexto**  
La base ya cubre los flujos principales de trabajo y no necesita crecer por expansión preventiva.

**Motivo**  
A partir de este punto el sistema debe evolucionar por uso real, no por acumulación de piezas.

**Implicaciones**  
Los cambios nuevos deben venir de necesidades observadas durante el trabajo, no de añadir estructura por anticipado.

**Cuándo revisarla**  
Si el sistema deja de ser útil o empieza a crecer sin control.
