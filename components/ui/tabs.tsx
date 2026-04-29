import { TextClassContext, textVariants } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import * as TabsPrimitive from '@rn-primitives/tabs';
import * as React from 'react';
import { Platform } from 'react-native';

/** Primitive typings omit `defaultValue` (Radix supports it on web); we lift uncontrolled state so context `value` is correct. */
type TabsProps = Omit<React.ComponentProps<typeof TabsPrimitive.Root>, 'value' | 'onValueChange'> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

/**
 * Wraps the primitive so `defaultValue` works: the upstream context only exposes `value`
 * from props, so uncontrolled tabs left `value` undefined and no trigger looked active.
 */
function Tabs({
  className,
  defaultValue,
  value: valueProp,
  onValueChange: onValueChangeProp,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
  const isControlled = valueProp !== undefined;
  const value = (isControlled ? valueProp : uncontrolledValue) ?? '';
  const onValueChange = React.useCallback(
    (v: string) => {
      onValueChangeProp?.(v);
      if (!isControlled) setUncontrolledValue(v);
    },
    [isControlled, onValueChangeProp]
  );

  return (
    <TabsPrimitive.Root
      className={cn('flex flex-col gap-2', className)}
      {...props}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'bg-muted flex h-9 flex-row items-center justify-center rounded-lg p-[3px]',
        Platform.select({ web: 'inline-flex w-fit', native: 'mr-auto' }),
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value: tabValue,
  disabled,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value: rootValue } = TabsPrimitive.useRootContext();
  const isActive = tabValue === rootValue;

  return (
    <TextClassContext.Provider
      value={cn(
        textVariants({ variant: 'labelSmall' }),
        isActive ? 'text-primary-foreground' : 'text-muted-foreground'
      )}>
      <TabsPrimitive.Trigger
        className={cn(
          'flex h-[calc(100%-1px)] flex-row items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1',
          Platform.select({
            web: cn(
              'inline-flex cursor-default whitespace-nowrap transition-[color,background-color,box-shadow] focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0'
            ),
          }),
          // Use `isActive` for fill (not `data-[state=active]:`): RN Web often skips data-* variants,
          // which left primary-foreground text on the muted track (unreadable).
          isActive && 'bg-primary shadow-sm shadow-black/10',
          !isActive && 'bg-transparent',
          disabled && 'opacity-50',
          className
        )}
        value={tabValue}
        disabled={disabled}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(Platform.select({ web: 'flex-1 outline-none' }), className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
