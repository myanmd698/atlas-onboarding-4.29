/**
 * On web, `import { useColorScheme } from 'react-native'` resolves to react-native-web,
 * which reads `Appearance` from the same singleton as `import { Appearance } from 'react-native'`.
 * Storybook’s shell (`@storybook/react-native` dist) uses that hook for `appliedTheme`.
 * Patching `react-native/Libraries/Utilities/Appearance` does nothing on web because that module
 * is not what RN-web’s `useColorScheme` uses.
 */
import { Appearance, Platform } from 'react-native';

let patched = false;

type AppearanceLike = {
  getColorScheme: () => 'light' | 'dark' | null | undefined;
  addChangeListener: (
    listener: (preferences: { colorScheme: string | null | undefined }) => void
  ) => { remove: () => void };
};

function patchAppearanceModule(AppearanceModule: AppearanceLike): void {
  const origGet = AppearanceModule.getColorScheme.bind(AppearanceModule);
  AppearanceModule.getColorScheme = function getColorSchemePatched() {
    const forced = (window as unknown as { __storybookForcedAppearance?: 'light' | 'dark' })
      .__storybookForcedAppearance;
    if (forced === 'light' || forced === 'dark') {
      return forced;
    }
    return origGet();
  };

  const origAdd = AppearanceModule.addChangeListener.bind(AppearanceModule);
  AppearanceModule.addChangeListener = function addChangeListenerPatched(
    listener: (preferences: { colorScheme: string | null | undefined }) => void
  ) {
    const sub = origAdd(listener);
    const onTheme = () => {
      listener({ colorScheme: AppearanceModule.getColorScheme() ?? null });
    };
    window.addEventListener('storybook-theme-change', onTheme);
    return {
      remove() {
        sub.remove();
        window.removeEventListener('storybook-theme-change', onTheme);
      },
    };
  };
}

export function installStorybookWebAppearancePatch(): void {
  if (patched || Platform.OS !== 'web' || typeof window === 'undefined') return;

  try {
    const appearance = Appearance as unknown as AppearanceLike;
    if (typeof appearance.getColorScheme !== 'function' || typeof appearance.addChangeListener !== 'function') {
      return;
    }
    patchAppearanceModule(appearance);
    patched = true;
  } catch {
    /* bundle shape may differ */
  }
}

export function setStorybookWebForcedAppearance(
  theme: 'light' | 'dark' | 'system',
): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { __storybookForcedAppearance?: 'light' | 'dark' };
  if (theme === 'system') {
    delete w.__storybookForcedAppearance;
  } else {
    w.__storybookForcedAppearance = theme;
  }
  window.dispatchEvent(new Event('storybook-theme-change'));
}
