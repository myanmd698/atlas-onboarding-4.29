/**
 * Actionsheet: bottom sheet component.
 *
 * Borrowed from Gluestack UI v3 (gluestack-ui.com/docs/components/disclosure/actionsheet).
 * Rebuilt on top of React Native Modal + Animated + @rn-primitives/portal
 * to stay compatible with the project's existing NativeWind + @rn-primitives stack.
 *
 * Exports mirror Gluestack v3 naming so this is a drop-in mental model:
 *   <Actionsheet isOpen onClose>
 *     <ActionsheetBackdrop />
 *     <ActionsheetContent>
 *       <ActionsheetDragIndicatorWrapper>
 *         <ActionsheetDragIndicator />
 *       </ActionsheetDragIndicatorWrapper>
 *       <ActionsheetItem onPress={…}>
 *         <ActionsheetItemText>Delete</ActionsheetItemText>
 *       </ActionsheetItem>
 *     </ActionsheetContent>
 *   </Actionsheet>
 */

import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { cn } from '~/lib/utils';
import { Text } from '~/components/ui/text';

// ─── Context ──────────────────────────────────────────────────────────────────

type ActionsheetContextValue = {
  isOpen: boolean;
  onClose: () => void;
};

const ActionsheetContext = React.createContext<ActionsheetContextValue>({
  isOpen: false,
  onClose: () => {},
});

// ─── Root ─────────────────────────────────────────────────────────────────────

type ActionsheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Actionsheet({ isOpen, onClose, children }: ActionsheetProps) {
  return (
    <ActionsheetContext.Provider value={{ isOpen, onClose }}>
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={onClose}>
        {children}
      </Modal>
    </ActionsheetContext.Provider>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────

type ActionsheetBackdropProps = {
  className?: string;
};

function ActionsheetBackdrop({ className }: ActionsheetBackdropProps) {
  const { onClose } = React.useContext(ActionsheetContext);
  return (
    <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close action sheet">
      <View className={cn('absolute inset-0 bg-black/65', className)} />
    </TouchableWithoutFeedback>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

const SCREEN_HEIGHT = Dimensions.get('window').height;

type ActionsheetContentProps = {
  children: React.ReactNode;
  className?: string;
  /** Max sheet height as a fraction of screen height (0–1). Default 0.85 */
  maxHeightFraction?: number;
};

function ActionsheetContent({
  children,
  className,
  maxHeightFraction = 0.85,
}: ActionsheetContentProps) {
  const { isOpen } = React.useContext(ActionsheetContext);
  const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (isOpen) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, translateY]);

  return (
    <View className="absolute inset-0 justify-end">
      <Animated.View
        style={[
          { transform: [{ translateY }], maxHeight: SCREEN_HEIGHT * maxHeightFraction },
        ]}
        className={cn(
          'rounded-t-[28px] overflow-hidden border-t border-border bg-muted pb-safe shadow-2xl dark:bg-background',
          className
        )}>
        {children}
      </Animated.View>
    </View>
  );
}

// ─── Drag Indicator Wrapper ───────────────────────────────────────────────────

function ActionsheetDragIndicatorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View className="items-center pt-3 pb-1">
      {children}
    </View>
  );
}

// ─── Drag Indicator ───────────────────────────────────────────────────────────

function ActionsheetDragIndicator() {
  return <View className="h-1 w-9 rounded-full bg-muted" />;
}

// ─── Scroll View ─────────────────────────────────────────────────────────────

type ActionsheetScrollViewProps = React.ComponentProps<typeof ScrollView>;

function ActionsheetScrollView({ className, ...props }: ActionsheetScrollViewProps) {
  return (
    <ScrollView
      className={cn('bg-muted px-4 dark:bg-background', className)}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...props}
    />
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

type ActionsheetItemProps = {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
};

function ActionsheetItem({ children, onPress, className, disabled }: ActionsheetItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      className={cn(
        'flex-row items-center gap-3 px-1 py-3.5 active:bg-muted/60 rounded-xl',
        disabled && 'opacity-40',
        className
      )}>
      {children}
    </Pressable>
  );
}

// ─── Item Text ────────────────────────────────────────────────────────────────

type ActionsheetItemTextProps = React.ComponentProps<typeof Text>;

function ActionsheetItemText({ className, ...props }: ActionsheetItemTextProps) {
  return (
    <Text
      variant="labelMedium"
      className={cn('text-foreground', className)}
      {...props}
    />
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function ActionsheetSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <View className="px-1 pb-2 pt-4">
      <Text variant="labelXSmall" className="uppercase tracking-widest text-muted-foreground">
        {children}
      </Text>
    </View>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetScrollView,
  ActionsheetSectionHeader,
};
