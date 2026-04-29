import * as React from 'react';
import { Appearance, useColorScheme as useRNColorScheme } from 'react-native';
import type { ColorSchemeName } from 'react-native';

/**
 * RN’s `useColorScheme()` is often `null` on iOS (incl. Expo Go) while traits resolve or when the
 * app defers to the system — that made “System” follow a false light theme. Merge with
 * `Appearance.getColorScheme()` and `addChangeListener` so we track the real OS light/dark.
 */
export function useMergedSystemColorSchemeName(): ColorSchemeName {
  const hookScheme = useRNColorScheme();
  const [listenerScheme, setListenerScheme] = React.useState<ColorSchemeName>(() => {
    const v = Appearance.getColorScheme();
    return v ?? 'light';
  });

  React.useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setListenerScheme(colorScheme ?? 'light');
    });
    return () => sub.remove();
  }, []);

  const merged = hookScheme ?? listenerScheme ?? Appearance.getColorScheme();
  /** Last resort avoids `null` (RN treats as “unspecified”); prefer wrong light over crashing. */
  return merged ?? 'light';
}
