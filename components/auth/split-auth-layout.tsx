import type { ReactNode } from 'react';
import { Platform, View } from 'react-native';

/** Web: optional split column; native: passthrough. */
export function SplitAuthLayout({
  children,
}: {
  children: ReactNode;
  variant?: 'monochrome';
}) {
  if (Platform.OS === 'web') {
    return (
      <View className="min-h-screen flex-1 flex-row bg-background">
        <View className="hidden flex-1 bg-muted/40 lg:flex lg:max-w-[42%]" />
        <View className="flex-1 items-center justify-center px-6 py-12">{children}</View>
      </View>
    );
  }
  return <>{children}</>;
}
