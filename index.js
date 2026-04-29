// Root entry so Metro always resolves `main` to this file (avoids tooling that breaks on
// `main` pointing only at `expo-router/entry`).
//
// Expo Router loads `@expo/metro-runtime` first from `expo-router/entry`. Avoid importing
// `react-native-gesture-handler` here (it runs before metro-runtime). Register RNGH via a
// top-of-file side effect in `app/_layout.tsx`.
import 'expo-router/entry';
