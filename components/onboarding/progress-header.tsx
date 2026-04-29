import type { Href } from 'expo-router';
import { Link } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '~/components/ui/icon';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';

type ProgressHeaderProps = {
  step: number;
  totalSteps?: number;
  /** Previous screen in the onboarding flow (used when `onBackPress` is not set). */
  backFallback: Href;
  /**
   * When set, runs instead of `Link` → `backFallback`. Use when `(auth)` would immediately
   * redirect back to onboarding while the user is still signed in (e.g. leave goal → sign-up).
   */
  onBackPress?: () => void | Promise<void>;
};

/**
 * Chevron is absolutely positioned so it stays above the centered logo row on RN Web.
 * Default navigation uses `Link`; custom `onBackPress` uses `Pressable` only (no competing redirect).
 */
export function ProgressHeader({
  step,
  totalSteps = 4,
  backFallback,
  onBackPress,
}: ProgressHeaderProps) {
  const pct = Math.round((step / totalSteps) * 100);

  const backControl = onBackPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={12}
      onPress={() => void Promise.resolve(onBackPress())}
      className="absolute left-0 top-0 z-[100] size-10 items-center justify-center rounded-full active:bg-accent web:cursor-pointer"
      style={{ zIndex: 100 }}>
      <Icon
        as={ChevronLeft}
        size={22}
        className="text-foreground"
        pointerEvents="none"
      />
    </Pressable>
  ) : (
    <Link href={backFallback} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={12}
        className="absolute left-0 top-0 z-[100] size-10 items-center justify-center rounded-full active:bg-accent web:cursor-pointer"
        style={{ zIndex: 100 }}>
        <Icon
          as={ChevronLeft}
          size={22}
          className="text-foreground"
          pointerEvents="none"
        />
      </Pressable>
    </Link>
  );

  return (
    <View className="border-b border-border bg-background px-4 pb-4 pt-2">
      <View className="relative mb-3 min-h-10 w-full items-center justify-center" pointerEvents="box-none">
        {backControl}
        <BrandMark />
      </View>
      <Text variant="labelSmall" className="mb-2 text-center text-muted-foreground">
        Step {step} of {totalSteps}
      </Text>
      <Progress value={pct} className="h-1.5" />
    </View>
  );
}

function BrandMark() {
  return (
    <View className="size-9 items-center justify-center rounded-xl border-2 border-foreground">
      <View className="size-3 rounded-full bg-foreground" />
    </View>
  );
}
