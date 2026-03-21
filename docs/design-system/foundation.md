# Festapp Design System Foundation

Base operativa del design system de Festapp. Esta capa no intenta redisenar toda la app de golpe. Su responsabilidad es dejar una foundation estable para:

- contraste fiable
- variantes previsibles
- ajustes visuales centralizados
- migraciones progresivas sin mezclar estilos locales rotos

## Arquitectura

La frontera entre capas queda asi:

- `app/globals.css`
  - Tokens globales del sistema.
  - Solo define primitives y semantic tokens.
- `components/ui`
  - Primitives de foundation inspiradas en shadcn/ui.
  - No conocen el dominio de Festapp.
  - Deben resolver estados, foco, alturas y variantes base.
- `components/shared`
  - Patrones visuales reutilizables de Festapp.
  - Componen primitives para resolver UI repetida sin acoplarla a una pantalla.
  - Ejemplos actuales: `SectionCard`, `Callout`, `InfoTile`, `FormField`.
- `components/cms`, `components/public`
  - Componentes de dominio.
  - Pueden combinar `ui` y `shared`, pero no redefinir variantes base locales salvo necesidad puntual y justificada.

## Tokens

Los tokens viven en [app/globals.css](/C:/dev/festapp/app/globals.css) y se organizan en dos niveles.

### 1. Primitive tokens

Definen la materia prima visual.

- Color:
  - `--color-stone-*`
  - `--color-sand-*`
  - `--color-red-*`
  - `--color-amber-*`
  - `--color-emerald-*`
- Typography:
  - `--font-family-sans`
  - `--font-family-display`
  - `--font-size-body`
  - `--font-size-label`
  - `--font-size-caption`
  - `--line-height-body`
  - `--line-height-tight`
- Radius:
  - `--radius-sm`
  - `--radius-md`
  - `--radius-lg`
  - `--radius-xl`
  - `--radius-pill`
- Spacing:
  - `--space-2`
  - `--space-3`
  - `--space-4`
  - `--space-5`
  - `--space-6`
  - `--space-8`
- Shadow:
  - `--shadow-card`
  - `--shadow-card-strong`
  - `--shadow-control`

### 2. Semantic tokens

Traducen primitives a intencion de interfaz.

- Surfaces and text:
  - `--background`
  - `--foreground`
  - `--surface`
  - `--surface-strong`
  - `--surface-muted`
  - `--border`
  - `--border-strong`
  - `--muted`
  - `--muted-foreground`
  - `--overlay`
- Actions:
  - `--primary`
  - `--primary-foreground`
  - `--primary-hover`
  - `--accent`
  - `--accent-foreground`
  - `--accent-hover`
- Status:
  - `--success`
  - `--success-surface`
  - `--success-border`
  - `--warning`
  - `--warning-surface`
  - `--warning-border`
  - `--danger`
  - `--danger-surface`
  - `--danger-border`
- Focus:
  - `--focus-ring`

### Regla de oro de tokens

- Si un cambio afecta a muchos componentes, empieza por tokens.
- Si solo afecta a la logica visual de un primitive, toca el primitive.
- Evita crear component tokens nuevos mientras semantic tokens cubran el caso con claridad.

## Primitives disponibles

En [components/ui](/C:/dev/festapp/components/ui):

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

### Contrato actual de primitives

- `Button`
  - Variantes: `default`, `outline`, `ghost`, `link`, `danger`
  - Variantes publicas adicionales: `accent`
  - Sizes: `sm`, `default`, `lg`
  - Debe resolver contraste, foco, disabled y jerarquia de CTA sin clases locales extra.
- `Input`, `Textarea`, `Select`
  - Comparten la base `controlBaseClassName`.
  - Deben mantener alturas, padding, borde y foco consistentes.
- `Checkbox`
  - Solo representa checkbox.
  - No acepta otros `type`.
- `Card`
  - Es surface estructural base.
  - No debe contener semantica de dominio.
  - Variantes base actuales:
    - `default`
    - `editorial`
    - `soft`
    - `strong`
- `Badge`
  - Resuelve estados cortos y etiquetas compactas.
- `Drawer`
  - Base visual y estructural para panel lateral.
  - Debe seguir siendo neutro respecto al dominio.
- `Table`
  - Primitive simple para tablas CMS cuando realmente haga falta, no por defecto.

## Shared components actuales

En [components/shared](/C:/dev/festapp/components/shared):

- `SectionCard`
  - Contenedor tematico principal de Festapp.
- `Callout`
  - Mensajes de `info`, `success`, `warning`, `error`.
- `InfoTile`
  - Bloques compactos de contexto o metricas.
- `FormField`
  - Shell de campo con label e hint.
- `CheckboxField`
  - Shell consistente para toggles booleanos.

En [components/public](/C:/dev/festapp/components/public):

- `PublicHeroBlock`
  - Hero editorial reusable para pantallas publicas clave.
- `PublicMediaPlaceholder`
  - Media visual reusable cuando el producto real aun no tiene imagen publicada.
- `PublicMetaRow`
  - Metadata compacta y silenciosa en pills.
- `PublicInfoPanel`
  - Paneles de contexto o dato practico.
- `PublicStoryCard`
  - Card editorial navegable para home, cambios o destacados.

## Como decidir donde toca un cambio

### Toca tokens cuando

- quieres ajustar contraste global
- quieres cambiar densidad general
- quieres mover radios o sombras del sistema
- quieres retocar superficies, bordes o texto de forma transversal

### Toca primitives cuando

- una variante de boton no responde bien
- un control tiene padding, foco o disabled inconsistentes
- varias pantallas necesitan el mismo ajuste de comportamiento visual

### Crea o ajusta un componente shared cuando

- un patron visual ya aparece repetido en varias pantallas
- el patron ya combina varios primitives de forma estable
- el nombre del componente tiene sentido fuera de una sola pantalla

### No crees un wrapper nuevo cuando

- solo tapa una clase puntual
- vive acoplado a una pagina concreta
- no sabes explicar su responsabilidad en una frase
- el cambio se resuelve mejor ajustando un primitive o un token

## Como decidir variantes

- `Button.default`
  - CTA principal de la accion actual.
- `Button.accent`
  - CTA principal de la app publica cuando hace falta un tono editorial terracota.
- `Button.outline`
  - CTA secundario o navegacion contextual.
- `Button.ghost`
  - Accion de baja jerarquia dentro de contenedores densos.
- `Button.link`
  - Navegacion textual o salida rapida sin peso de boton.
- `Button.danger`
  - Acciones destructivas o de riesgo.

Regla:

- si dudas entre dos variantes, la jerarquia probablemente no esta clara todavia

## Lo que hay que evitar

- repetir `bg-*`, `text-*`, `hover:*` en cada CTA critico
- meter correcciones de contraste con `className` local como primera opcion
- crear una variante "casi igual" a otra solo para una pantalla
- mover componentes de dominio a `components/ui`
- dejar labels, hints y checkboxes montados de forma distinta en cada formulario

## Migracion minima ya aplicada

La foundation ya se usa en zonas criticas del CMS:

- navegacion principal y CTAs clave
- formularios de:
  - `Nuevo festival`
  - `Nueva edicion`
  - `Nuevo acto`
  - `Editar festival`
  - `Editar edicion`
  - ficha de acto
- panel lateral del CMS sobre `Drawer`
- estados de actos con `Badge`
- bloques de contexto y metricas sobre `InfoTile`
- mensajes operativos sobre `Callout`

## Siguientes pasos recomendados

- `P1` Migrar accesos y formularios de `/acceso` y cabecera publica a primitives del sistema
  - Impacto: quedan focos de estilos locales fuera de la foundation
- `P1` Reducir colores inline en catalogo publico
  - Impacto: la parte publica todavia no aprovecha del todo la misma semantica que el CMS
- `P2` Evaluar si `Table` aporta valor real o puede esperar
  - Impacto: hoy existe como primitive preparado, pero aun no valida un caso fuerte
- `P2` Consolidar un patron shared para empty states si se repite un tercer caso claro
  - Impacto: ahora mismo hay varios vacios parecidos, pero aun no todos justifican wrapper propio
