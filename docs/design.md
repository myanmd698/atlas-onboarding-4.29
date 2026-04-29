# Design system (atlas-mvp-vibes)

Conventions so **web and native stay aligned** and we do not fight the primitives.

## Typography (`Text` + `textVariants`)

- **Variants are the contract.** Size, line height, and weight live in `components/ui/text.tsx` (`textVariants`). Use `variant="headingMedium"`, `variant="labelSmall"`, etc.
- **Do not override typography with weight utilities** on `<Text variant={…} />`:
  - Avoid: `font-medium`, `font-semibold`, `font-bold`, `font-sans-medium`, `font-sans-semibold`, `font-sans-bold`, or any extra `font-*` that changes weight.
  - Those classes stack badly with variants, break consistency, and on React Native they do not map onto Inter the way browsers do.
- **If you need a new weight or size:** add a **new variant** in `textVariants` (e.g. `labelSmallSemibold` for button labels) and use that name everywhere. Do not one-off patch with `className`.
- **Allowed `className` on `Text`:** color, alignment, spacing, `uppercase` / `tracking-*`, `text-center`, `numberOfLines`, and **semantic** tweaks that are not duplicating the scale (e.g. `text-muted-foreground`, `text-primary`). Prefer tokens over ad hoc sizes.
- **Why named Inter faces:** `font-sans` maps to `Inter_400Regular`. On native, `font-weight` + that family does not reliably select `Inter_500Medium` / `Inter_700Bold`. We use explicit families (`font-sans-medium`, `font-sans-semibold`) in variants so **iOS/Android match web**.

## Haptics (native only)

- Helpers in `lib/haptics.ts` (`hapticsSelection`, `hapticsImpactLight`, `hapticsImpactMedium`) map to **medium / medium / heavy** impact on native. They no-op on web; failures are swallowed.
- **Medium impact** — bottom tab presses, sidebar nav (`onPressIn`), pressable `Item` rows, `Button` (most variants), `Checkbox`, `Switch`, `Toggle`.
- **Heavy impact** — `Button` with `variant="destructive"`.
- Add new patterns by calling the helpers from native code paths (`Platform.OS !== 'web'`) inside the primitive, not scattered in screens.

## Icons (Lucide)

- Prefer `<Icon as={…} />` from `components/ui/icon.tsx` so **stroke width defaults** apply (`lib/lucide.ts` → `LUCIDE_STROKE_WIDTH`).
- If you render a Lucide icon **without** `Icon`, pass `strokeWidth={LUCIDE_STROKE_WIDTH}` (or the constant from `~/lib/lucide`) so strokes stay consistent.
- **Checkbox** and similar components may set their own `strokeWidth` for legibility; that is intentional.

## Layout / navigation

- **Main column width / padding:** `MAIN_CONTENT_MAX_WIDTH_CLASS` in `components/layout/main-content.tsx` (used by web shell). Do not duplicate max-width/padding on every screen unless there is a special case.
- **Native tabs vs web:** Bottom tabs are `app/(app)/_layout.tsx`; web uses `app/(app)/_layout.web.tsx`. Hiding a tab from native only (`href: null`) is separate from removing a route file.

## When changing this doc

If you introduce a new pattern (e.g. a second sans family, or a new emphasis level), **update variants in `text.tsx` first**, then add a short note here so future changes stay centralized.
