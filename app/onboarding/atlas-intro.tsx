import { useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { CyclingPromptField } from '~/components/onboarding/cycling-prompt-field';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

const TOTAL_STEPS = 9;

const POWERS: { title: string; description: string }[] = [
  {
    title: 'Unify your money story',
    description:
      'See spending, savings, and investments in one place so nothing important stays siloed.',
  },
  {
    title: 'Stress-test big decisions',
    description:
      'Ask whether a purchase or trade-off fits your plan before you commit real dollars.',
  },
  {
    title: 'Plan life events with clarity',
    description: 'Map milestones and “what if” paths without rebuilding the spreadsheet every week.',
  },
];

export default function OnboardingAtlasIntroScreen() {
  const router = useRouter();

  const inner = (
    <View className="gap-4">
      <View className="mb-2">
        <Text variant="headingLarge" className="font-serif">
          {"I'm Atlas AI"}
        </Text>
        <Text variant="paragraphMedium" className="mt-2 text-muted-foreground">
          Your personal financial advisor.
        </Text>
      </View>

      <CyclingPromptField />

      <View className="mt-8 gap-2">
        <Text variant="labelMedium" className="text-foreground">
          {"Here's how I can help"}
        </Text>
        <Card className="gap-0 py-0">
          <CardContent className="p-0">
            {POWERS.map((item, i) => (
              <View
                key={item.title}
                className={cn(
                  'flex-row gap-3 px-4 py-4 md:px-6',
                  i > 0 && 'border-t border-border'
                )}>
                <View
                  className="mt-0.5 size-7 items-center justify-center rounded-full bg-muted"
                  accessibilityLabel={`${i + 1}`}>
                  <Text variant="labelSmallSemibold" className="text-muted-foreground">
                    {i + 1}
                  </Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text variant="labelMedium" className="text-foreground">
                    {item.title}
                  </Text>
                  <Text variant="paragraphSmall" className="mt-1 text-muted-foreground">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>
      </View>

      <Button className="mt-4 w-full" onPress={() => router.push('/onboarding/household')}>
        <Text>Continue</Text>
      </Button>
    </View>
  );

  const body = (
    <>
      <ProgressHeader step={2} totalSteps={TOTAL_STEPS} backFallback="/onboarding/goal" />
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
