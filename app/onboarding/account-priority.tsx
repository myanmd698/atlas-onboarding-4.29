import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { LinkPlanHeroChart, LINK_PLAN_HERO_COPY } from '~/components/onboarding/link-plan-hero-chart';
import { ONBOARDING_CONTENT_WIDTH_CLASS } from '~/components/onboarding/layout';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { getAccountPriority } from '~/lib/onboarding-account-priority';
import { GOAL_SELECTION_COPY } from '~/lib/onboarding-goal-selection-copy';
import type { GoalId } from '~/lib/onboarding-types';
import { useOnboarding } from '~/lib/onboarding';
import { cn } from '~/lib/utils';

const TOTAL_STEPS = 5;

const LINK_TIMELINE = {
  title: 'Link your accounts',
} as const;

const INSIGHT_TIMELINE = {
  title: 'Get financial insights at a glance',
} as const;

function goalPlanChips(goal: GoalId): [string, string] {
  switch (goal) {
    case 'spending-control':
      return ['Spending clarity', 'Atlas coaching'];
    case 'saving-enough':
      return ['Savings pace', 'Atlas coaching'];
    case 'less-stress':
      return ['What matters', 'Atlas coaching'];
    case 'partner-alignment':
      return ['Shared picture', 'Atlas coaching'];
    case 'big-plans':
      return ['Future planning', 'Atlas coaching'];
    case 'clear-picture':
    default:
      return ['Full picture', 'Atlas coaching'];
  }
}

export default function OnboardingAccountPriorityScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const priority = getAccountPriority(data.goal, data.goalCalibration);

  const goalCopy = data.goal ? GOAL_SELECTION_COPY[data.goal] : null;
  const [chipA, chipB] = data.goal ? goalPlanChips(data.goal) : ['Your goals', 'Atlas coaching'];

  React.useEffect(() => {
    if (!data.goal) {
      router.replace('/onboarding/goal');
    }
  }, [data.goal, router]);

  if (!data.goal || !goalCopy) {
    return null;
  }

  const inner = (
    <View className={`gap-5 ${ONBOARDING_CONTENT_WIDTH_CLASS}`}>
      <View className="gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Text variant="headingXXLarge" className="font-serif">
          Simplify your money.
        </Text>
        <LinkPlanHeroChart />
        <Text variant="paragraphMedium" className="leading-relaxed text-muted-foreground">
          {LINK_PLAN_HERO_COPY}
        </Text>
      </View>

      <View className="gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <View>
          <Text variant="headingXLarge" className="font-serif">
            Your recommended plan
          </Text>
          <Text variant="paragraphSmall" className="mt-1 text-muted-foreground">
            Based on your goals
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <View className="flex-row items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5">
            <Icon as={Check} size={14} className="text-brand" />
            <Text variant="paragraphSmall" className="font-medium text-foreground" numberOfLines={1}>
              {chipA}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5">
            <Icon as={Check} size={14} className="text-brand" />
            <Text variant="paragraphSmall" className="font-medium text-foreground" numberOfLines={1}>
              {chipB}
            </Text>
          </View>
        </View>

        <View className="pt-1">
          {[
            { key: 'link' as const, title: LINK_TIMELINE.title },
            { key: 'goal' as const, title: goalCopy.label },
            { key: 'insights' as const, title: INSIGHT_TIMELINE.title },
          ].map((row, i, arr) => (
            <View key={row.key} className="flex-row gap-3">
              <View className="items-center">
                {row.key === 'link' ? (
                  <View className="size-8 items-center justify-center rounded-full bg-brand">
                    <View className="size-2.5 rounded-full bg-white" />
                  </View>
                ) : (
                  <View className="size-8 rounded-full border-2 border-muted-foreground/35 bg-background" />
                )}
                {i < arr.length - 1 ? <View className="h-11 w-0.5 bg-border" /> : null}
              </View>
              <View className={cn('min-w-0 flex-1', i < arr.length - 1 ? 'pb-5' : '')}>
                <Text variant="labelLarge" className="text-foreground">
                  {row.title}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Button className="mt-1 w-full" onPress={() => router.push('/onboarding/link')}>
        <Text>{priority.firstCta}</Text>
      </Button>
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={3} totalSteps={TOTAL_STEPS} backFallback="/onboarding/goal" />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow pb-10"
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
