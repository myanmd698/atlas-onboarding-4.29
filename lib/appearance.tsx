import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Appearance, Platform } from 'react-native';

import { normalizeSystemScheme, resolveScheme } from '~/lib/appearance-resolve';
import { DEFAULT_APPEARANCE_PREFERENCE, type AppearancePreference } from '~/lib/appearance-types';
import { useMergedSystemColorSchemeName } from '~/lib/use-merged-system-color-scheme';

/** Legacy key — only used to clear old values alongside the current key. */
export const APPEARANCE_STORAGE_KEY_LEGACY = '@atlas-mvp-vibes/appearance-preference';

/**
 * Current storage key. Bumped so installs pick up default **system** without inheriting stale
 * light/dark from earlier prototypes (`v1` often contained `dark` from testing).
 */
export const APPEARANCE_STORAGE_KEY = '@atlas-mvp-vibes/appearance-preference-v2';

export type { AppearancePreference } from '~/lib/appearance-types';

type AppearanceContextValue = {
  preference: AppearancePreference;
  setPreference: (p: AppearancePreference) => Promise<void>;
  /** Resolved light/dark after applying system preference. */
  resolved: 'light' | 'dark';
  /** True after the first AsyncStorage read for appearance preference completes. */
  hydrated: boolean;
};

const AppearanceContext = React.createContext<AppearanceContextValue | null>(null);

export { normalizeSystemScheme, resolveScheme } from '~/lib/appearance-resolve';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const systemScheme = useMergedSystemColorSchemeName();
  const [preference, setPreferenceState] = React.useState<AppearancePreference>(
    DEFAULT_APPEARANCE_PREFERENCE
  );
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      const v = await AsyncStorage.getItem(APPEARANCE_STORAGE_KEY);
      if (v === 'light' || v === 'dark' || v === 'system') {
        setPreferenceState(v);
      } else {
        setPreferenceState(DEFAULT_APPEARANCE_PREFERENCE);
        await AsyncStorage.setItem(APPEARANCE_STORAGE_KEY, DEFAULT_APPEARANCE_PREFERENCE);
      }
      await AsyncStorage.removeItem(APPEARANCE_STORAGE_KEY_LEGACY);
      setHydrated(true);
    })();
  }, []);

  const resolved = React.useMemo(
    () => resolveScheme(preference, systemScheme),
    [preference, systemScheme]
  );

  React.useLayoutEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    if (preference === 'system') {
      setColorScheme(normalizeSystemScheme(systemScheme) === 'dark' ? 'dark' : 'light');
    } else {
      setColorScheme(preference);
    }

    if (Platform.OS !== 'web') {
      if (preference === 'system') {
        Appearance.setColorScheme('unspecified');
      } else {
        Appearance.setColorScheme(preference);
      }
    }
  }, [resolved, preference, systemScheme, setColorScheme]);

  const setPreference = React.useCallback(async (p: AppearancePreference) => {
    setPreferenceState(p);
    await AsyncStorage.setItem(APPEARANCE_STORAGE_KEY, p);
  }, []);

  const value = React.useMemo(
    () => ({ preference, setPreference, resolved, hydrated }),
    [preference, setPreference, resolved, hydrated]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const ctx = React.useContext(AppearanceContext);
  if (!ctx) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return ctx;
}

export const THEME_LABELS: Record<AppearancePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};
