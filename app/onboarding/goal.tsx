import { useRouter } from 'expo-router';
import {
  BanknoteArrowUp,
  Handshake,
  House,
  PiggyBank,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { ONBOARDING_CONTENT_WIDTH_CLASS } from '~/components/onboarding/layout';
import { OptionCard } from '~/components/onboarding/option-card';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { GOAL_SELECTION_COPY } from '~/lib/onboarding-goal-selection-copy';
import type { GoalId } from '~/lib/onboarding-types';
import { useOnboarding } from '~/lib/onboarding';

const GOAL_PICK_ORDER = [
  'spending-control',
  'saving-enough',
  'less-stress',
  'partner-alignment',
  'big-plans',
] as const satisfies readonly GoalId[];

const GOAL_ICON: Record<(typeof GOAL_PICK_ORDER)[number], LucideIcon> = {
  'spending-control': BanknoteArrowUp,
  'saving-enough': PiggyBank,
  'less-stress': ShieldCheck,
  'partner-alignment': Handshake,
  'big-plans': House,
};

const OPTIONS = GOAL_PICK_ORDER.map((id) => ({
  id,
  icon: GOAL_ICON[id],
  ...GOAL_SELECTION_COPY[id],
}));

export default function OnboardingGoalScreen() {
  const router = useRouter();
  const { data, setGoal } = useOnboarding();
  const selected = data.goal;
  const canContinue = Boolean(selected);

  const onContinue = () => {
    if (!selected) return;
    router.push('/onboarding/account-priority');
  };

  const inner = (
    <View className={`gap-4 ${ONBOARDING_CONTENT_WIDTH_CLASS}`}>
      <View className="mb-2">
        <Text variant="headingLarge" className="font-serif">
          Where do you want to start?
        </Text>
      </View>
      {OPTIONS.map((o) => (
        <OptionCard
          key={o.id}
          label={o.label}
          icon={o.icon}
          selected={selected === o.id}
          onPress={() => setGoal(o.id)}
        />
      ))}
      <Button
        className="mt-4 w-full"
        disabled={!canContinue}
        onPress={onContinue}>
        <Text>Continue</Text>
      </Button>
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={2} totalSteps={5} backFallback="/onboarding/primer" />
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
