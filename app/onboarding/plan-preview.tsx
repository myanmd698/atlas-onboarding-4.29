import { useRouter } from 'expo-router';
import { Check, Lock } from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { GOAL_LABEL, PRIMARY_FOCUS_LABEL } from '~/lib/onboarding-labels';
import { useOnboarding } from '~/lib/onboarding';
import { cn } from '~/lib/utils';

const TOTAL_STEPS = 9;

const PLAN_STEPS: { title: string; body: string; status: 'done' | 'current' | 'upcoming' }[] = [
  {
    title: 'Link your accounts',
    body: 'The more Atlas sees, the smarter your picture gets.',
    status: 'current',
  },
  {
    title: 'Track your net worth',
    body: 'See cash, investments, and debt in one place.',
    status: 'upcoming',
  },
  {
    title: 'Optimize your finances',
    body: 'Run scenarios, tighten allocations, and get nudges that match your goals.',
    status: 'upcoming',
  },
];

function truncatePill(s: string, max = 34) {
  const t = s.trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

export default function OnboardingPlanPreviewScreen() {
  const router = useRouter();
  const { data } = useOnboarding();

  const pills = React.useMemo(() => {
    if (data.goal) {
      return [truncatePill(GOAL_LABEL[data.goal]), 'AI financial guidance'];
    }
    return ['Your priorities mapped', 'AI financial guidance'];
  }, [data.goal]);

  const planSubtitle = data.primaryFocus
    ? `Based on your focus: ${PRIMARY_FOCUS_LABEL[data.primaryFocus]}`
    : 'Based on your goals and profile';

  const inner = (
    <View className="gap-4">
      <Card>
        <CardContent className="gap-4 pt-6">
          <View className="h-40 items-center justify-center overflow-hidden rounded-xl bg-muted">
            <View className="rounded-full border-2 border-border bg-card p-4 shadow-sm">
              <Icon as={Lock} size={32} className="text-foreground" />
            </View>
          </View>
          <Text variant="paragraphMedium" className="text-center text-muted-foreground">
            Connect your accounts next to unlock your personalized Atlas plan and budget view.
          </Text>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="gap-4 pt-6">
          <View>
            <Text variant="headingLarge" className="font-serif">
              Your recommended plan
            </Text>
            <Text variant="paragraphMedium" className="mt-2 text-muted-foreground">
              {planSubtitle}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {pills.map((label, pi) => (
              <View
                key={`${pi}-${label}`}
                className="max-w-full flex-row items-center gap-1.5 rounded-full bg-secondary px-3 py-2">
                <Icon as={Check} size={16} className="text-secondary-foreground" />
                <Text
                  variant="labelSmall"
                  className="shrink text-secondary-foreground"
                  numberOfLines={1}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-2">
            {PLAN_STEPS.map((step, i) => (
              <View key={step.title} className="flex-row">
                <View className="mr-3 w-8 items-center">
                  <TimelineDot status={step.status} />
                  {i < PLAN_STEPS.length - 1 ? (
                    <View
                      className={cn(
                        'mt-1 w-0.5',
                        step.status === 'done' ? 'bg-primary' : 'bg-border'
                      )}
                      style={{ height: 40 }}
                    />
                  ) : null}
                </View>
                <View className={cn('min-w-0 flex-1', i < PLAN_STEPS.length - 1 && 'pb-2')}>
                  <Text variant="labelMedium" className="text-foreground">
                    {step.title}
                  </Text>
                  <Text variant="paragraphSmall" className="mt-1 text-muted-foreground">
                    {step.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      <Button
        className="mt-4 w-full"
        accessibilityLabel="Link your accounts"
        onPress={() => router.push('/onboarding/link')}>
        <Text>Link your accounts</Text>
      </Button>
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={6} totalSteps={TOTAL_STEPS} backFallback="/onboarding/life-events" />
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

function TimelineDot({ status }: { status: 'done' | 'current' | 'upcoming' }) {
  if (status === 'done') {
    return (
      <View className="size-8 items-center justify-center rounded-full bg-primary">
        <Icon as={Check} size={16} className="text-primary-foreground" />
      </View>
    );
  }
  if (status === 'current') {
    return (
      <View className="size-8 items-center justify-center rounded-full border-2 border-primary bg-background">
        <View className="size-2 rounded-full bg-primary" />
      </View>
    );
  }
  return (
    <View className="size-8 items-center justify-center rounded-full bg-muted">
      <View className="size-2 rounded-full bg-muted-foreground/70" />
    </View>
  );
}
