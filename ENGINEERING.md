# Engineering handoff

This repo is an Expo Router + React Native (NativeWind) prototype. The sections below are meant to help a product team adopt or replace pieces without spelunking the whole tree.

## Run / build

| Command        | Purpose                          |
| -------------- | -------------------------------- |
| `npm start`    | Expo dev server                  |
| `npm run web`  | Web target                       |
| `npm run build`| Static web export (`expo export`)|
| `npm test`     | Jest (pure logic + unit tests)   |
| `npm run typecheck` | `tsc --noEmit`              |
| `npm run lint` | ESLint via `expo lint`         |

Node **20.x** is declared in `package.json` `engines`.

## Architecture (high level)

- **Entry:** [`index.js`](index.js) → `expo-router/entry`.
- **Root layout:** [`app/_layout.tsx`](app/_layout.tsx) — `AppearanceProvider` → `AuthProvider` → `OnboardingProvider` → navigation shell. Exports an **`ErrorBoundary`** for Expo Router’s route error handling (see [`components/app-root-error-boundary.tsx`](components/app-root-error-boundary.tsx)); failures are logged through [`lib/report-error.ts`](lib/report-error.ts) (replace with your monitoring SDK).
- **Bootstrap:** [`lib/splash-controller.tsx`](lib/splash-controller.tsx) calls `SplashScreen.hideAsync()` only after fonts load and **auth, onboarding, and appearance** have hydrated from `AsyncStorage` — avoids a blank frame between splash and UI.
- **Gates:** [`app/(app)/_layout.tsx`](app/(app)/_layout.tsx) redirects by auth + onboarding completion via [`canAccessAppShell`](lib/auth.tsx).

## Replacement seams (good places to swap implementations)

| Concern        | Location |
| -------------- | -------- |
| Session / user | [`lib/auth.tsx`](lib/auth.tsx) (`AUTH_STORAGE_KEY`, `signIn` / `signUp` / `signOut`) |
| Onboarding     | [`lib/onboarding.tsx`](lib/onboarding.tsx), shared types [`lib/onboarding-types.ts`](lib/onboarding-types.ts), scoring [`lib/onboarding-score.ts`](lib/onboarding-score.ts) |
| Theme / NativeWind | [`lib/appearance.tsx`](lib/appearance.tsx), resolution helpers [`lib/appearance-resolve.ts`](lib/appearance-resolve.ts) |
| Tab “no animation” hack | [`lib/expo-router-tab-navigation.ts`](lib/expo-router-tab-navigation.ts) — used by [`components/nav/app-bottom-tab-bar.tsx`](components/nav/app-bottom-tab-bar.tsx) |

## Environment / storage

- No cloud env vars are required for the demo; persistence is **AsyncStorage** under keys such as `@atlas-mvp-vibes/auth` and `@atlas-mvp-vibes/onboarding`.
- Appearance preference uses [`APPEARANCE_STORAGE_KEY`](lib/appearance.tsx) (`…-v2`; legacy `…-preference` is removed on load) and is intentionally kept when demo data is cleared. Default is **System** ([`DEFAULT_APPEARANCE_PREFERENCE`](lib/appearance-types.ts)); [`app.json`](app.json) sets **`userInterfaceStyle`: `automatic`** so iOS/Android follow the OS appearance. On iOS (incl. Expo Go), `useColorScheme()` alone is often `null`; [`useMergedSystemColorSchemeName`](lib/use-merged-system-color-scheme.ts) merges **`Appearance.getColorScheme()`** and **`Appearance.addChangeListener`** so “System” tracks the real light/dark mode.

## Known technical debt

1. **Tab bar navigation:** Primary native tabs use an **undocumented** Expo Router query param (`__internal_expo_router_no_animation`) so stack transitions match tab behavior. It is centralized in [`lib/expo-router-tab-navigation.ts`](lib/expo-router-tab-navigation.ts). Revisit when upgrading **expo-router**; alternatives include a real `Tabs` layout or accepting stack animations between tab targets.
2. **Demo auth:** Username/password `test` / `test` maps to a mock user; sign-up writes local storage only. Replace with your auth backend and tighten validation (e.g. Zod on persisted JSON) when moving toward production.
3. **NativeWind on shell components:** Avoid `className` on the root `View` beside `Stack` in [`app/_layout.tsx`](app/_layout.tsx) and on **`SafeAreaView`** inside navigators — theme toggles can trigger React Navigation “navigation context” errors. Use plain `style` on those primitives and put `className` (including `dark`) on an inner `View`. Settings screens follow this pattern.

## Tests

- **Jest 29** + **jest-expo** preset; path alias `~/` matches `tsconfig.json`.
- AsyncStorage is mocked in [`jest.setup.js`](jest.setup.js).
- Prefer testing **pure modules** (`lib/appearance-resolve.ts`, `lib/onboarding-score.ts`, `canAccessAppShell`) to avoid heavy RN mocks.
