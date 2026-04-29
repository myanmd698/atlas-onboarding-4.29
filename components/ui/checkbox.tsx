import { Icon } from '~/components/ui/icon';
import { hapticsImpactLight } from '~/lib/haptics';
import { cn } from '~/lib/utils';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Platform } from 'react-native';

const DEFAULT_HIT_SLOP = 24;

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  checkedClassName?: string;
  indicatorClassName?: string;
  iconClassName?: string;
  /** Web / uncontrolled: initial value when `checked` is omitted */
  defaultChecked?: boolean;
};

function Checkbox({
  className,
  checkedClassName,
  indicatorClassName,
  iconClassName,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    () => defaultChecked ?? false
  );
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolledChecked;

  const handleCheckedChange = React.useCallback(
    (value: boolean) => {
      if (Platform.OS !== 'web') {
        hapticsImpactLight();
      }
      onCheckedChange?.(value);
      if (!isControlled) {
        setUncontrolledChecked(value);
      }
    },
    [isControlled, onCheckedChange]
  );

  return (
    <CheckboxPrimitive.Root
      {...props}
      className={cn(
        'border-input dark:bg-input/30 size-4 shrink-0 rounded-[4px] border shadow-sm shadow-black/5',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed',
          native: 'overflow-hidden',
        }),
        checked && cn('border-primary', checkedClassName),
        props.disabled && 'opacity-50',
        className
      )}
      checked={checked}
      hitSlop={DEFAULT_HIT_SLOP}
      onCheckedChange={handleCheckedChange}
    >
      <CheckboxPrimitive.Indicator
        className={cn('bg-primary h-full w-full items-center justify-center', indicatorClassName)}>
        <Icon
          as={Check}
          size={12}
          strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5}
          className={cn('text-primary-foreground', iconClassName)}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
