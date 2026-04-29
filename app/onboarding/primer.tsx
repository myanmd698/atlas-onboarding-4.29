import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainContent } from '~/components/layout/main-content';
import { ONBOARDING_CONTENT_WIDTH_CLASS } from '~/components/onboarding/layout';
import { ProgressHeader } from '~/components/onboarding/progress-header';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/lib/auth';

const VALUE_PROPS = [
  'A clear picture without tracking every line item.',
  "Insights on what's changed, what's steady, and what needs attention.",
  'Confidence to test big decisions with your real balances.',
  'A shared snapshot for important money conversations.',
];

export default function OnboardingPrimerScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const onBackFromPrimer = React.useCallback(async () => {
    await signOut();
    router.replace('/sign-up');
  }, [router, signOut]);

  const inner = (
    <View className={`flex-1 justify-center gap-8 ${ONBOARDING_CONTENT_WIDTH_CLASS}`}>
      <View className="items-center">
        <Text variant="headingLarge" className="text-center font-serif">
          See where you stand in minutes.
        </Text>
      </View>

      <View className="w-full gap-5">
        <View className="gap-4">
          {VALUE_PROPS.map((item) => (
            <View key={item} className="flex-row gap-3">
              <View className="mt-0.5 size-5 items-center justify-center rounded-full bg-brand">
                <Icon as={Check} size={13} className="text-brand-foreground" />
              </View>
              <Text variant="paragraphMedium" className="min-w-0 flex-1 leading-relaxed text-foreground">
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Button className="w-full" onPress={() => router.push('/onboarding/goal')}>
        <Text>Continue</Text>
      </Button>
    </View>
  );

  const body = (
    <>
      <ProgressHeader
        step={1}
        totalSteps={5}
        backFallback="/sign-up"
        onBackPress={onBackFromPrimer}
      />
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
