import {
  Castoro_400Regular,
  Castoro_400Regular_Italic,
} from '@expo-google-fonts/castoro';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  useFonts,
} from '@expo-google-fonts/figtree';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';

/**
 * Loaded font modules for `useFonts`. Add or remove weights here, then mirror
 * `fontFamily` names in `tailwind.config.js` (`font-sans` / `font-mono` / `font-serif`).
 *
 * Body: Figtree (400/500/600/700)
 * Headline: Castoro (400 Regular — display serif)
 * Mono: JetBrains Mono
 */
export const appFontSources = {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Castoro_400Regular,
  Castoro_400Regular_Italic,
  JetBrainsMono_400Regular,
} as const;

/** Post-load family names (must match Tailwind `fontFamily` entries). */
export const fontFamily = {
  sans: 'Figtree_400Regular',
  sansMedium: 'Figtree_500Medium',
  sansSemibold: 'Figtree_600SemiBold',
  sansBold: 'Figtree_700Bold',
  serif: 'Castoro_400Regular',
  serifItalic: 'Castoro_400Regular_Italic',
  mono: 'JetBrainsMono_400Regular',
} as const;

export function useAppFonts() {
  return useFonts(appFontSources);
}
