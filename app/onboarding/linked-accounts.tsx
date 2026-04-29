import { useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { ONBOARDING_CONTENT_WIDTH_CLASS } from '~/components/onboarding/layout';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Text } from '~/components/ui/text';
import { getMockAccountById } from '~/lib/mockAccounts';
import { useOnboarding } from '~/lib/onboarding';

function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function categoryLabel(category: 'cash' | 'investments' | 'debt'): string {
  if (category === 'cash') return 'Cash';
  if (category === 'investments') return 'Investments';
  return 'Debt';
}

export default function OnboardingLinkedAccountsScreen() {
  const router = useRouter();
  const { data, markComplete } = useOnboarding();
  const ids = data.linkedBankIds;

  React.useEffect(() => {
    if (ids.length === 0) {
      router.replace('/onboarding/link');
    }
  }, [ids.length, router]);

  const markedCompleteRef = React.useRef(false);
  /** Onboarding ends on this screen; mark complete once accounts are present (no navigation away). */
  React.useEffect(() => {
    if (ids.length === 0 || markedCompleteRef.current) return;
    markedCompleteRef.current = true;
    void markComplete();
  }, [ids.length, markComplete]);

  const rows = React.useMemo(
    () =>
      ids.map((id) => {
        const a = getMockAccountById(id);
        return {
          id,
          institutionName: a?.institutionName ?? 'Bank',
          name: a?.name ?? 'Linked account',
          accountNumber: a?.accountNumber ?? '—',
          balance: a?.balance ?? 0,
          category: a?.category ?? ('cash' as const),
        };
      }),
    [ids]
  );

  const inner = (
    <View className={`gap-5 ${ONBOARDING_CONTENT_WIDTH_CLASS}`}>
      <View>
        <Text variant="headingLarge" className="font-serif">
          Your linked accounts
        </Text>
        <Text variant="paragraphMedium" className="mt-2 text-muted-foreground">
          These institutions are connected. You can add or manage accounts anytime from settings.
        </Text>
      </View>

      <View className="gap-3">
        {rows.map((a) => (
          <View
            key={a.id}
            className="rounded-xl border border-border bg-card px-4 py-3">
            <Text variant="labelSmall" className="text-muted-foreground">
              {a.institutionName}
            </Text>
            <Text variant="labelMedium" className="mt-1 text-foreground">
              {a.name}
            </Text>
            <View className="mt-2 flex-row flex-wrap items-baseline justify-between gap-2">
              <Text variant="paragraphSmall" className="text-muted-foreground">
                {a.accountNumber}
              </Text>
              <Text variant="labelMedium" className="text-foreground">
                {formatUsd(a.balance)}
              </Text>
            </View>
            <Text variant="paragraphXSmall" className="mt-2 text-muted-foreground">
              {categoryLabel(a.category)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={5} totalSteps={5} backFallback="/onboarding/link" />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow pb-10 pt-4"
        showsVerticalScrollIndicator={false}>
        {Platform.OS === 'web' ? (
          <MainContent>{inner}</MainContent>
        ) : (
          <View className="px-5">{inner}</View>
        )}
      </ScrollView>
    </>
  );

  if (ids.length === 0) {
    return null;
  }

  if (Platform.OS === 'web') {
    return <View className="min-h-screen flex-1 bg-background">{body}</View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {body}
    </SafeAreaView>
  );
}
