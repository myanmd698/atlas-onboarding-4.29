import type { ErrorBoundaryProps } from 'expo-router';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { reportError } from '~/lib/report-error';

/**
 * Root route error UI: avoids Expo Router’s default boundary, which renders `Link` and can
 * throw “no navigation context” while handling another error.
 */
export function AppRootErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  React.useEffect(() => {
    reportError(error, 'root-route');
  }, [error]);

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Something went wrong</Text>
      <Text style={{ opacity: 0.85 }}>{error.message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => void retry()}
        style={{
          alignSelf: 'flex-start',
          marginTop: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: '#111',
        }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Try again</Text>
      </Pressable>
    </View>
  );
}
