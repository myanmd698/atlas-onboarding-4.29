import { hapticsImpactLight } from '~/lib/haptics';
import { cn } from '~/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import * as React from 'react';
import { Platform } from 'react-native';

type SwitchProps = React.ComponentProps<typeof SwitchPrimitives.Root> & {
  /** Web / uncontrolled: initial value when `checked` is omitted */
  defaultChecked?: boolean;
};

function Switch({
  className,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  ...props
}: SwitchProps) {
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
    <SwitchPrimitives.Root
      {...props}
      className={cn(
        'flex h-[1.15rem] w-8 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        checked ? 'bg-primary' : 'bg-input dark:bg-input/80',
        props.disabled && 'opacity-50',
        className
      )}
      checked={checked}
      onCheckedChange={handleCheckedChange}>
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background size-4 rounded-full transition-transform',
          Platform.select({
            web: 'pointer-events-none block ring-0',
          }),
          checked
            ? 'dark:bg-primary-foreground translate-x-3.5'
            : 'dark:bg-foreground translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
