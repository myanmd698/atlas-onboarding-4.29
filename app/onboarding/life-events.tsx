import { useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { OptionCard } from '~/components/onboarding/option-card';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import type { LifeEventId } from '~/lib/onboarding-types';
import { useOnboarding } from '~/lib/onboarding';

const OPTIONS: { id: LifeEventId; label: string; description?: string }[] = [
  { id: 'buy_home', label: 'Buying a home', description: 'Down payment, mortgage, and cash reserves.' },
  { id: 'marriage', label: 'Marriage or partnership', description: 'Aligning accounts, goals, and legal basics.' },
  { id: 'retirement', label: 'Retirement planning', description: 'Translating today’s numbers into future income.' },
  { id: 'new_child', label: 'Growing the family', description: 'Costs, leave, and education timelines.' },
  { id: 'education', label: 'Education funding', description: '529s, cash flow, and trade-offs.' },
  { id: 'job_change', label: 'Job or income change', description: 'Equity, bonuses, and runway.' },
  {
    id: 'none_soon',
    label: 'Nothing major in the next ~2 years',
    description: 'Steady state — you mostly want tracking and small optimizations.',
  },
];

const TOTAL_STEPS = 9;

export default function OnboardingLifeEventsScreen() {
  const router = useRouter();
  const { data, toggleLifeEvent } = useOnboarding();
  const selected = new Set(data.lifeEventIds);

  const inner = (
    <View className="gap-4">
      <View className="mb-2">
        <Text variant="headingLarge" className="font-serif">
          What’s on your horizon?
        </Text>
        <Text variant="paragraphMedium" className="mt-2 text-muted-foreground">
          Life events are when finances get painful — we’ll surface impact and “what if you do
          nothing” scenarios. Select all that apply.
        </Text>
      </View>
      {OPTIONS.map((o) => (
        <OptionCard
          key={o.id}
          label={o.label}
          description={o.description}
          selected={selected.has(o.id)}
          onPress={() => toggleLifeEvent(o.id)}
        />
      ))}
      <Button
        className="mt-4 w-full"
        disabled={data.lifeEventIds.length === 0}
        onPress={() => router.push('/onboarding/plan-preview')}>
        <Text>Continue</Text>
      </Button>
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={4} totalSteps={TOTAL_STEPS} backFallback="/onboarding/household" />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {Platform.OS === 'web' ? (
          <MainContent>{inner}</MainContent>
        ) : (
          <View className="px-5 pt-4">{inner}</View>
        )}
      </ScrollView>
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
