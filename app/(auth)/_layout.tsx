import { Redirect, Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

import { canAccessAppShell, useAuth } from '~/lib/auth';
import { useAppearance } from '~/lib/appearance';
import { useOnboarding } from '~/lib/onboarding';
import { THEME } from '~/lib/theme';
import { cn } from '~/lib/utils';

export default function AuthLayout() {
  const { user, hydrated: authH } = useAuth();
  const { data, hydrated: obH } = useOnboarding();
  const { resolved } = useAppearance();

  if (!authH || !obH) {
    return null;
  }

  if (user && canAccessAppShell(user, data.completed)) {
    return <Redirect href="/" />;
  }
  if (user && !canAccessAppShell(user, data.completed)) {
    return <Redirect href="/onboarding/primer" />;
  }

  return (
    <View
      className={cn('flex-1', resolved === 'dark' && 'dark')}
      style={{ flex: 1, backgroundColor: THEME[resolved].background }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </View>
  );
}
