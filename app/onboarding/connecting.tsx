import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { getMockAccountById } from '~/lib/mockAccounts';
import { useOnboarding } from '~/lib/onboarding';

const STEP_MS = 1200;

export default function OnboardingConnectingScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const ids = data.linkedBankIds;
  const [index, setIndex] = React.useState(0);

  const labels = React.useMemo(
    () =>
      ids.map((id) => {
        const a = getMockAccountById(id);
        return a?.institutionName ?? 'Bank';
      }),
    [ids]
  );

  React.useEffect(() => {
    if (labels.length === 0) {
      router.replace('/onboarding/link');
      return;
    }
    if (index >= labels.length) {
      const t = setTimeout(() => {
        router.replace('/onboarding/linked-accounts');
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIndex((i) => i + 1);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [index, labels.length, labels, router]);

  const currentLabel = index < labels.length ? labels[index] : null;

  const body = (
    <>
      <ProgressHeader step={5} totalSteps={5} backFallback="/onboarding/link" />
      <View className="flex-1 items-center justify-center px-6 pb-20">
        <View className="mb-8 size-16 items-center justify-center rounded-full bg-muted">
          {index < labels.length ? (
            <ActivityIndicator size="large" />
          ) : (
            <Icon as={Check} size={32} className="text-emerald-500" />
          )}
        </View>
        <Text variant="headingMedium" className="mb-2 text-center font-serif">
          {index < labels.length ? `Checking ${currentLabel}…` : 'All set'}
        </Text>
        <Text variant="paragraphMedium" className="mb-8 text-center text-muted-foreground">
          {index < labels.length
            ? 'Pulling recent activity and balances.'
            : 'Taking you to your account summary…'}
        </Text>
        {index >= labels.length ? (
          <ActivityIndicator className="mb-6" />
        ) : null}
        <View className="w-full max-w-sm gap-2">
          {labels.map((label, i) => {
            const done = index >= labels.length || i < index;
            return (
              <View
                key={`${label}-${i}`}
                className="flex-row items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <View
                  className={`size-6 items-center justify-center rounded-full ${
                    done ? 'bg-emerald-500' : 'bg-muted'
                  }`}>
                  {done ? (
                    <Icon as={Check} size={14} className="text-white" />
                  ) : (
                    <Text variant="labelSmall" className="text-muted-foreground">
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text variant="labelMedium" className="flex-1 text-foreground">
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );

  if (Platform.OS === 'web') {
    return <View className="min-h-screen flex-1 bg-background">{body}</View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {body}
    </SafeAreaView>
  );
}
