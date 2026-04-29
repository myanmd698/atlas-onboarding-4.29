import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  Appearance,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme as useRNColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { NAV_THEME } from '../lib/theme';

import { setStorybookWebForcedAppearance } from './storybook-web-appearance-patch';

export type StorybookThemeChoice = 'light' | 'dark' | 'system';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
    alignSelf: 'stretch',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  /** Scroll host so long stories (e.g. Typography table) aren’t clipped. */
  storyCanvasScroll: {
    flex: 1,
    minHeight: 0,
    alignSelf: 'stretch',
    ...Platform.select({
      web: { width: '100%' as const, height: '100%' as const },
      default: {},
    }),
  },
  storyCanvasContent: {
    padding: 16,
    alignItems: 'stretch',
    flexGrow: 1,
  },
});

/** Storybook’s preview panel on web often needs an explicit height for flex children to fill and center. */
const frameProps = Platform.select({
  web: { style: [styles.frame, { height: '100%', minHeight: '100%' }] as const },
  default: { style: styles.frame },
});

function resolveNavScheme(
  theme: StorybookThemeChoice,
  systemScheme: 'light' | 'dark' | null | undefined,
): 'light' | 'dark' {
  if (theme === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return theme;
}

function StorybookProviders({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: StorybookThemeChoice;
}) {
  const { setColorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const navScheme = resolveNavScheme(theme, systemScheme);

  React.useLayoutEffect(() => {
    if (Platform.OS === 'web') {
      setStorybookWebForcedAppearance(theme);
    }

    // Native only: react-native-web’s Appearance has no setColorScheme. Use public API (not deep imports).
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
    }

    if (theme === 'system') {
      setColorScheme(systemScheme === 'dark' ? 'dark' : 'light');
    } else {
      setColorScheme(theme);
    }
  }, [theme, systemScheme, setColorScheme]);

  return (
    <GestureHandlerRootView className="flex-1 font-sans" style={{ flex: 1 }}>
      <ThemeProvider value={NAV_THEME[navScheme]}>
        <SafeAreaProvider>
          {children}
          <PortalHost />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Wraps stories with NativeWind + navigation theme and a theme dropdown
 * (React Native Storybook does not render the web Storybook toolbar / globals UI).
 */
export function StorybookThemeFrame({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<StorybookThemeChoice>('system');

  const selectedOption = React.useMemo(() => {
    const found = THEME_OPTIONS.find((o) => o.value === theme);
    return found
      ? { value: found.value, label: found.label }
      : { value: 'system', label: 'System' };
  }, [theme]);

  return (
    <StorybookProviders theme={theme}>
      <View {...frameProps}>
        <View className="border-b border-border" style={styles.bar}>
          <Text className="text-xs font-medium text-muted-foreground">Theme</Text>
          <Select
            value={selectedOption}
            onValueChange={(opt) => {
              if (opt?.value) {
                setTheme(opt.value as StorybookThemeChoice);
              }
            }}>
            <SelectTrigger size="sm" className="h-8 min-w-[9.5rem]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="min-w-[9.5rem]">
              <SelectItem value="light" label="Light" />
              <SelectItem value="dark" label="Dark" />
              <SelectItem value="system" label="System" />
            </SelectContent>
          </Select>
        </View>
        <ScrollView
          style={styles.storyCanvasScroll}
          contentContainerStyle={styles.storyCanvasContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator>
          {children}
        </ScrollView>
      </View>
    </StorybookProviders>
  );
}
