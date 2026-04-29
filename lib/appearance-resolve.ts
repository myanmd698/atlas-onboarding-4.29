import type { ColorSchemeName } from 'react-native';

import type { AppearancePreference } from '~/lib/appearance-types';

export function normalizeSystemScheme(system: ColorSchemeName | null | undefined): 'light' | 'dark' | null {
  if (system === 'dark') return 'dark';
  if (system === 'light') return 'light';
  return null;
}

export function resolveScheme(
  preference: AppearancePreference,
  system: ColorSchemeName | null | undefined
): 'light' | 'dark' {
  if (preference === 'system') {
    const s = normalizeSystemScheme(system);
    return s === 'dark' ? 'dark' : 'light';
  }
  return preference;
}
