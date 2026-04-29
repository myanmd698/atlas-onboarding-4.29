import { useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { OptionCard } from '~/components/onboarding/option-card';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import type { HouseholdId } from '~/lib/onboarding-types';
import { useOnboarding } from '~/lib/onboarding';

const OPTIONS: { id: HouseholdId; label: string; description?: string }[] = [
  { id: 'solo', label: 'Just me', description: 'I am the primary decision-maker for my finances.' },
  {
    id: 'with_partner',
    label: 'Me and a partner',
    description: 'We coordinate — sometimes one of us needs the full picture.',
  },
  {
    id: 'young_children',
    label: 'Young children at home',
    description: 'Cash flow and big goals are a moving target — clarity matters.',
  },
];

const TOTAL_STEPS = 9;

export default function OnboardingHouseholdScreen() {
  const router = useRouter();
  const { data, setHousehold } = useOnboarding();
  const selected = data.household;

  const inner = (
    <View className="gap-4">
      <View className="mb-2">
        <Text variant="headingLarge" className="font-serif">
          Who’s in your financial picture?
        </Text>
        <Text variant="paragraphMedium" className="mt-2 text-muted-foreground">
          We’ll tailor summaries and AI nudges — especially when you need to share context with
          someone else.
        </Text>
      </View>
      {OPTIONS.map((o) => (
        <OptionCard
          key={o.id}
          label={o.label}
          description={o.description}
          selected={selected === o.id}
          onPress={() => setHousehold(o.id)}
        />
      ))}
      <Button
        className="mt-4 w-full"
        disabled={!selected}
        onPress={() => router.push('/onboarding/life-events')}>
        <Text>Continue</Text>
      </Button>
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={3} totalSteps={TOTAL_STEPS} backFallback="/onboarding/atlas-intro" />
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
