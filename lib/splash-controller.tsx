import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

import { useAppearance } from '~/lib/appearance';
import { useAuth } from '~/lib/auth';
import { useOnboarding } from '~/lib/onboarding';

/**
 * Hides the native splash only after fonts, auth, onboarding, and appearance preferences
 * have finished loading — avoids a blank frame between splash and the app shell.
 */
export function SplashController({
  fontsLoaded,
  fontError,
}: {
  fontsLoaded: boolean;
  fontError: Error | null | undefined;
}) {
  const { hydrated: appearanceHydrated } = useAppearance();
  const { hydrated: authHydrated } = useAuth();
  const { hydrated: onboardingHydrated } = useOnboarding();

  React.useEffect(() => {
    const fontsReady = fontsLoaded || fontError;
    if (!fontsReady || !authHydrated || !onboardingHydrated || !appearanceHydrated) {
      return;
    }
    void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError, authHydrated, onboardingHydrated, appearanceHydrated]);

  return null;
}
