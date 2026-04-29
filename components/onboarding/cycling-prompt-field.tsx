import { Send } from 'lucide-react-native';
import * as React from 'react';
import { Keyboard, Platform, Pressable, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '~/components/ui/icon';
import { Text, textVariants } from '~/components/ui/text';
import { hapticsImpactLight } from '~/lib/haptics';
import { cn } from '~/lib/utils';

const TYPE_MS = 42;
const HOLD_MS = 2200;
const DELETE_MS = 28;
const BETWEEN_PROMPTS_MS = 380;
const BEFORE_START_MS = 450;

const DEFAULT_PROMPTS = [
  'When can I retire?',
  'Can I afford this house?',
  'How much should I save each month?',
  'Am I on track for a big purchase?',
] as const;

const COMPOSER_VARIANT = 'paragraphMedium' as const;

function useTypewriterCycle(prompts: readonly string[], active: boolean) {
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    if (!active) {
      setText('');
      return;
    }

    let cancelled = false;
    let promptIdx = 0;
    let displayedLen = 0;
    let phase: 'typing' | 'holding' | 'deleting' | 'gap' = 'typing';
    let tid: ReturnType<typeof setTimeout>;

    const schedule = (fn: () => void, ms: number) => {
      tid = setTimeout(fn, ms);
    };

    const loop = () => {
      if (cancelled) return;
      const full = prompts[promptIdx];

      if (phase === 'typing') {
        if (displayedLen < full.length) {
          displayedLen += 1;
          setText(full.slice(0, displayedLen));
          schedule(loop, TYPE_MS);
        } else {
          phase = 'holding';
          schedule(loop, HOLD_MS);
        }
      } else if (phase === 'holding') {
        phase = 'deleting';
        schedule(loop, DELETE_MS);
      } else if (phase === 'deleting') {
        if (displayedLen > 0) {
          displayedLen -= 1;
          setText(full.slice(0, displayedLen));
          schedule(loop, DELETE_MS);
        } else {
          promptIdx = (promptIdx + 1) % prompts.length;
          phase = 'gap';
          schedule(loop, BETWEEN_PROMPTS_MS);
        }
      } else if (phase === 'gap') {
        phase = 'typing';
        schedule(loop, TYPE_MS);
      }
    };

    schedule(loop, BEFORE_START_MS);

    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [active, prompts]);

  return text;
}

function BlinkingCursor() {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.15, { duration: 520 }), withTiming(1, { duration: 520 })),
      -1,
      false
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Text
      style={style}
      className={cn(textVariants({ variant: COMPOSER_VARIANT }), 'text-muted-foreground')}>
      |
    </Animated.Text>
  );
}

type CyclingPromptFieldProps = {
  prompts?: readonly string[];
  className?: string;
};

/**
 * Chat-style composer with typewriter example prompts (empty + unfocused only) and send control.
 */
export function CyclingPromptField({ prompts = DEFAULT_PROMPTS, className }: CyclingPromptFieldProps) {
  const [value, setValue] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const showAnimation = !focused && value.length === 0;
  const animatedLine = useTypewriterCycle(prompts, showAnimation);
  const canSend = value.trim().length > 0;

  const composerTextClass = textVariants({ variant: COMPOSER_VARIANT });

  const handleSend = React.useCallback(() => {
    if (!canSend) return;
    hapticsImpactLight();
    Keyboard.dismiss();
    setValue('');
  }, [canSend]);

  return (
    <View
      className={cn(
        'w-full flex-row items-center gap-2 rounded-2xl border border-input bg-background p-2 pl-4 shadow-sm shadow-black/5',
        Platform.select({
          web: 'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        }),
        className
      )}>
      <View className="relative min-h-[48px] flex-1 justify-center py-1 pr-1">
        <TextInput
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? 'Ask me anything…' : ''}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (canSend) handleSend();
          }}
          caretHidden={showAnimation}
          className={cn(
            composerTextClass,
            'max-h-28 min-h-[28px] flex-1 bg-transparent py-2 text-foreground',
            Platform.select({
              web: cn(
                'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none',
                'md:text-[16px] md:leading-[24px]'
              ),
              native: 'placeholder:text-muted-foreground/50',
            })
          )}
          accessibilityLabel="Ask Atlas a question. Example prompts animate when the field is empty."
          multiline
        />
        {showAnimation ? (
          <View
            pointerEvents="none"
            className="absolute inset-0 flex-row items-center py-2"
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden>
            <Text variant={COMPOSER_VARIANT} className="shrink text-muted-foreground" numberOfLines={2}>
              {animatedLine}
            </Text>
            <BlinkingCursor />
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send message"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={handleSend}
        className={cn(
          'size-11 shrink-0 items-center justify-center rounded-full bg-primary active:bg-primary/90',
          Platform.select({ web: 'cursor-pointer' }),
          !canSend && 'opacity-40'
        )}>
        <Icon as={Send} size={22} className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
