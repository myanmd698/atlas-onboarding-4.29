import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { Platform, View } from 'react-native';

import { AppRootErrorBoundary } from '~/components/app-root-error-boundary';
import { AppearanceProvider, useAppearance } from '~/lib/appearance';
import { AuthProvider } from '~/lib/auth';
import { OnboardingProvider } from '~/lib/onboarding';
import { useAppFonts } from '~/lib/fonts';
import { SplashController } from '~/lib/splash-controller';
import { NAV_THEME, THEME } from '~/lib/theme';

void SplashScreen.preventAutoHideAsync();

/**
 * React Navigation theme + safe area + plain RN `View` surface (no NativeWind `className` here:
 * styled `View` in this slot can trigger navigation-context errors with Expo Router).
 */
function ThemedNavigationChrome({ children }: { children: React.ReactNode }) {
  const { resolved } = useAppearance();
  const bg = THEME[resolved].background;

  return (
    <ThemeProvider value={NAV_THEME[resolved]}>
      {/*
        SafeAreaProvider is supplied by Expo Router’s ExpoRoot; avoid nesting a second provider.
      */}
      <View
        style={
          Platform.OS === 'web'
            ? { flex: 1, minHeight: '100%', backgroundColor: bg }
            : { flex: 1, backgroundColor: bg }
        }>
        {children}
      </View>
    </ThemeProvider>
  );
}

function RootStackNavigation() {
  const { resolved } = useAppearance();
  const bg = THEME[resolved].background;

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle:
            Platform.OS === 'web'
              ? { flex: 1, backgroundColor: 'transparent' }
              : { flex: 1, backgroundColor: bg },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </>
  );
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <AppRootErrorBoundary {...props} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();

  // #region agent log
  React.useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    fetch('http://127.0.0.1:7296/ingest/8ca10641-5bf3-4fb5-8642-08318e4e7f93', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '816752' },
      body: JSON.stringify({
        sessionId: '816752',
        location: 'app/_layout.tsx:RootLayout',
        message: 'fonts ready; root will render',
        data: {
          fontsLoaded,
          fontError: fontError?.message ?? null,
          platform: Platform.OS,
        },
        timestamp: Date.now(),
        hypothesisId: 'H2',
        runId: 'post-fix',
      }),
    }).catch(() => {});
  }, [fontsLoaded, fontError]);
  // #endregion

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={Platform.OS === 'web' ? { minHeight: '100%', width: '100%' } : { flex: 1 }}>
      <AppearanceProvider>
        <AuthProvider>
          <OnboardingProvider>
            <SplashController fontsLoaded={fontsLoaded} fontError={fontError} />
            <ThemedNavigationChrome>
              <RootStackNavigation />
            </ThemedNavigationChrome>
          </OnboardingProvider>
        </AuthProvider>
      </AppearanceProvider>
    </GestureHandlerRootView>
  );
}
