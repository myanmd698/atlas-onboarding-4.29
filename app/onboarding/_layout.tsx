import { Redirect, Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

import { canAccessAppShell, useAuth } from '~/lib/auth';
import { useAppearance } from '~/lib/appearance';
import { useOnboarding } from '~/lib/onboarding';
import { THEME } from '~/lib/theme';
import { cn } from '~/lib/utils';

export default function OnboardingLayout() {
  const { user, hydrated: ah } = useAuth();
  const { data, hydrated: oh } = useOnboarding();
  const { resolved } = useAppearance();

  if (!ah || !oh) {
    return null;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  /**
   * Always render the Stack when signed in. Do not Redirect when onboarding is complete:
   * redirecting to `/onboarding/plan-preview` from this layout runs for that route too and
   * causes a self-redirect / blank web screen (Expo Router).
   */
  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7296/ingest/8ca10641-5bf3-4fb5-8642-08318e4e7f93', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '816752' },
      body: JSON.stringify({
        sessionId: '816752',
        location: 'app/onboarding/_layout.tsx',
        message: 'onboarding layout rendering Stack',
        data: {
          onboardingCompleted: data.completed,
          canAccessAppShell: canAccessAppShell(user, data.completed),
        },
        timestamp: Date.now(),
        hypothesisId: 'H6',
        runId: 'post-fix-2',
      }),
    }).catch(() => {});
  }, [user, data.completed]);
  // #endregion

  return (
    <View
      className={cn('flex-1', resolved === 'dark' && 'dark')}
      style={{ flex: 1, backgroundColor: THEME[resolved].background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}
