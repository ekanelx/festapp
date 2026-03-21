# Design System Documentation: The Curated Canvas

## 1. Overview & Creative North Star
**Creative North Star: The Curated Canvas**
In an industry often defined by neon pulses and visual noise, this design system takes a contrarian stance. It is an editorial-first framework that treats festival information with the reverence of a high-end gallery catalogue. We move away from the "event app" template toward a "digital concierge" experience.

By leveraging **intentional asymmetry**, wide margins, and a sophisticated tonal palette, we create an environment that feels premium, calm, and highly functional. We prioritize information density through refined typography rather than decorative UI elements. The layout should feel "assembled" rather than "gridded," utilizing overlapping layers and varying container heights to guide the eye.

---

## 2. Colors
Our palette is rooted in earth and stone, moving away from digital vibrance toward tactile warmth.

*   **Primary (#5f5e5e):** Used for authoritative text and structural anchors.
*   **Secondary (#954a25):** Our "Terracotta" accent. Use sparingly for primary actions or to highlight "Live" festival statuses.
*   **Surface Hierarchy:** Our foundation is `surface` (#fafaf5). Depth is built through nesting, not lines.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined exclusively through background color shifts. For example, a `surface_container_low` (#f3f4ee) section should sit directly against a `surface` (#fafaf5) background to create a soft, sophisticated transition.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
- **Base:** `surface`
- **Secondary Content:** `surface_container_low`
- **Interactive Cards:** `surface_container_highest`
By nesting a `surface_container_lowest` card inside a `surface_container_high` section, we achieve "natural lift" without visual clutter.

### Glass & Gradient Rule
For floating navigation or top-level overlays, use **Glassmorphism**. Apply `surface` with 80% opacity and a 20px backdrop blur. For primary CTAs, use a subtle linear gradient transitioning from `secondary` to `secondary_dim` to provide a "silk-finish" texture that flat colors cannot replicate.

---

## 3. Typography
We pair the architectural strength of **Manrope** with the utilitarian precision of **Inter**.

*   **Display & Headlines (Manrope):** Use these for editorial impact. Large scales (`display-lg` at 3.5rem) should use tighter letter-spacing (-0.02em) to feel like a premium magazine cover.
*   **Body & Titles (Inter):** These are the workhorses. Inter provides exceptional legibility for dense festival schedules and artist bios.
*   **Labeling (Inter):** Use `label-md` for metadata (dates, stages, genres). These should often be in `on_surface_variant` to maintain a quiet visual hierarchy.

The contrast between a `display-md` headline and a `body-md` description creates the "Editorial" feel—don't be afraid of the size gap; it signals clear importance.

---

## 4. Elevation & Depth
Depth is a psychological cue, not a stylistic flourish.

*   **The Layering Principle:** Stack `surface_container` tiers to create hierarchy. A "Schedule Item" should sit on `surface_container_low`, while the "Current Playing" item should be elevated to `surface_container_lowest` (Pure White) to draw the eye.
*   **Ambient Shadows:** If a card must float, use an ambient shadow: `offset-y: 8px, blur: 24px, color: rgba(46, 52, 45, 0.06)`. This mimics soft, natural light rather than a digital drop shadow.
*   **The "Ghost Border" Fallback:** For high-density data grids where separation is critical, use a **Ghost Border**. Apply `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Background `secondary`, text `on_secondary`. Shape: `lg` (0.5rem). Use a subtle inner-glow (1px white overlay at 10%) to create a premium "pressed" feel.
*   **Secondary:** Background `primary_container`, text `on_primary_container`. No border.
*   **Tertiary:** Text `primary` with no container. Use for low-priority actions like "View Map."

### Cards & Lists
*   **The Rule of Separation:** Forbid the use of divider lines. Separate list items using `spacing-3` (1rem) of vertical white space or by alternating background shifts between `surface` and `surface_container_low`.
*   **Editorial Cards:** Use `surface_container_highest` for card backgrounds. Use asymmetrical padding (e.g., `padding-top: 4, padding-inline: 3, padding-bottom: 3`) to create a bespoke, custom feel.

### Chips
*   **Filter Chips:** Use `surface_container_high` with `rounded-full`. When active, transition to `secondary` with `on_secondary` text.
*   **Genre Tags:** Keep these minimal. Use `body-sm` text with `on_surface_variant`, no background container.

### Input Fields
*   **Text Inputs:** Use `surface_container_lowest` background. Instead of a full border, use a 2px bottom stroke in `outline_variant`. On focus, the stroke transitions to `secondary`.

### Specialized Festival Components
*   **Lineup Timeline:** A vertical track using `outline_variant` at 20% opacity. Artist names in `title-md`, stage names in `label-sm`.
*   **Status Indicators:** For "Capacity" or "Stage Status," use a soft-pulse animation on a small circle using `secondary_fixed_dim`.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `spacing-8` and `spacing-10` to create "breathing rooms" between major content blocks.
*   **Do** use `surface_container_lowest` for the most important interactive elements to make them "pop" against the sand/beige backgrounds.
*   **Do** treat images as editorial assets—use `rounded-lg` and ensure they align with the text baseline.

### Don't:
*   **Don't** use pure black (#000000). Always use `on_surface` (#2e342d) for text to maintain the warm, organic tone.
*   **Don't** use standard Material or iOS "Action Sheets." Create custom, layered drawers using `surface_bright` and `xl` corner radius.
*   **Don't** use icons as primary navigation without labels. The editorial style demands clarity.
*   **Don't** use harsh 1px dividers. If you feel the need for a line, try a background color shift first.