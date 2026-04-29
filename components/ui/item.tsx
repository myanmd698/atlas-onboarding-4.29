import { Separator } from '~/components/ui/separator';
import { Text } from '~/components/ui/text';
import { hapticsSelection } from '~/lib/haptics';
import { cn } from '~/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Pressable, View, type PressableProps, type ViewProps } from 'react-native';

const ItemSelectedContext = React.createContext(false);

/** Matches shadcn Item: `default` | `sm` | `xs` (maps legacy `compact` → `sm`). */
type ItemSize = 'default' | 'sm' | 'xs';
const ItemSizeContext = React.createContext<ItemSize>('default');

const itemVariants = cva('flex flex-row items-center gap-3 px-4', {
  variants: {
    /**
     * Surfaces aligned with `Button` / `Card`. See shadcn Item variants (`default`, `outline`, `muted`) plus app tokens.
     */
    variant: {
      default: 'bg-transparent',
      outline: 'border-border bg-background border shadow-sm shadow-black/5',
      secondary: 'bg-secondary',
      muted: 'bg-muted',
      inset: 'bg-muted/40 mx-2 rounded-xl',
      highlight: cn(
        'border-2 border-brand-300 bg-brand-50 shadow-sm shadow-black/5 dark:border-brand-700 dark:bg-brand-950'
      ),
    },
    size: {
      default: 'min-h-[56px] py-2.5',
      sm: 'min-h-11 py-1.5',
      xs: 'min-h-9 py-1',
    },
    selected: {
      true: 'ring-2 ring-inset ring-primary/35 dark:ring-primary/45',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    selected: false,
  },
});

const itemMediaVariants = cva('shrink-0 flex-row items-center justify-center', {
  variants: {
    size: {
      default: 'w-10',
      sm: 'w-8',
      xs: 'w-7',
    },
  },
  defaultVariants: { size: 'default' },
});

/** Group is a border/background shell only; horizontal padding lives on each `Item` (`px-4`). */
const itemGroupVariants = cva('flex flex-col p-0', {
  variants: {
    variant: {
      default: 'gap-0',
      loose: 'gap-2',
    },
  },
  defaultVariants: { variant: 'default' },
});

type ItemProps = Omit<ViewProps, 'children'> &
  Omit<VariantProps<typeof itemVariants>, 'size'> & {
    /** `compact` is an alias for `sm` (legacy `ListItem`). */
    size?: VariantProps<typeof itemVariants>['size'] | 'compact';
    children?: React.ReactNode;
    onPress?: PressableProps['onPress'];
    android_ripple?: PressableProps['android_ripple'];
    disabled?: boolean;
  };

function Item({
  className,
  variant,
  size,
  selected,
  onPress,
  android_ripple,
  disabled,
  children,
  ...props
}: ItemProps) {
  const rowSize: ItemSize = size === 'compact' ? 'sm' : (size ?? 'default');
  const rowClass = cn(
    itemVariants({ variant, size: rowSize, selected }),
    onPress &&
      Platform.select({
        default: 'active:bg-accent',
        web: 'cursor-pointer hover:bg-accent/60 active:bg-accent',
      }),
    disabled && 'pointer-events-none opacity-50',
    className
  );

  const handlePress = React.useCallback(
    (e: Parameters<NonNullable<typeof onPress>>[0]) => {
      if (Platform.OS !== 'web') {
        hapticsSelection();
      }
      onPress?.(e);
    },
    [onPress]
  );

  return (
    <ItemSizeContext.Provider value={rowSize}>
      <ItemSelectedContext.Provider value={!!selected}>
        {onPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: !!selected, disabled: !!disabled }}
            disabled={disabled}
            onPress={handlePress}
            android_ripple={android_ripple}
            className={rowClass}
            {...props}
          >
            {children}
          </Pressable>
        ) : (
          <View accessibilityState={{ selected: !!selected }} className={rowClass} {...props}>
            {children}
          </View>
        )}
      </ItemSelectedContext.Provider>
    </ItemSizeContext.Provider>
  );
}

type ItemMediaProps = React.ComponentProps<typeof View> & {
  /** `icon`: fixed column for Lucide icons. `image` / `avatar`: wider slots (shadcn `ItemMedia`). */
  media?: 'icon' | 'image' | 'avatar';
};

function ItemMedia({ className, media = 'icon', ...props }: ItemMediaProps) {
  const rowSize = React.useContext(ItemSizeContext);
  if (media === 'image') {
    return (
      <View className={cn('w-12 shrink-0 overflow-hidden rounded-md', className)} {...props} />
    );
  }
  if (media === 'avatar') {
    return <View className={cn('w-10 shrink-0', className)} {...props} />;
  }
  return (
    <View className={cn(itemMediaVariants({ size: rowSize }), className)} {...props} />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View className={cn('min-w-0 flex-1 flex-col justify-center gap-0.5', className)} {...props} />
  );
}

function ItemTitle({
  className,
  variant = 'labelMedium',
  numberOfLines,
  ...props
}: React.ComponentProps<typeof Text>) {
  const selected = React.useContext(ItemSelectedContext);
  return (
    <Text
      variant={variant}
      numberOfLines={numberOfLines}
      className={cn('text-foreground', selected && 'text-primary', className)}
      {...props}
    />
  );
}

function ItemDescription({
  className,
  variant = 'paragraphSmall',
  numberOfLines,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      variant={variant}
      numberOfLines={numberOfLines}
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Trailing slot: values, chevrons, badges, switches (shadcn `ItemActions`). */
function ItemActions({ className, ...props }: React.ComponentProps<typeof View>) {
  const rowSize = React.useContext(ItemSizeContext);
  const maxW =
    rowSize === 'default' ? 'max-w-[45%]' : rowSize === 'sm' ? 'max-w-[42%]' : 'max-w-[40%]';
  return (
    <View
      className={cn('flex min-w-0 shrink flex-row items-center justify-end gap-2', maxW, className)}
      {...props}
    />
  );
}

type ItemValueTextProps = React.ComponentProps<typeof Text> & {
  /** Right-aligned supplementary text in `ItemActions`. */
  valueVariant?: 'value' | 'muted' | 'caption';
  /** @deprecated Use `valueVariant` */
  trailingVariant?: 'value' | 'muted' | 'caption';
};

function ItemValueText({
  className,
  valueVariant,
  trailingVariant,
  numberOfLines = 1,
  ...props
}: ItemValueTextProps) {
  const tone = valueVariant ?? trailingVariant ?? 'muted';
  const textVariant =
    tone === 'value'
      ? 'labelMedium'
      : tone === 'caption'
        ? 'paragraphXSmall'
        : 'paragraphSmall';
  return (
    <Text
      variant={textVariant}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      className={cn(
        'text-right tabular-nums',
        tone === 'value' && 'text-foreground',
        tone === 'muted' && 'text-muted-foreground',
        tone === 'caption' && 'text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function ItemValueStack({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View className={cn('min-w-0 flex-col items-end justify-center gap-0', className)} {...props} />
  );
}

type ItemGroupProps = React.ComponentProps<typeof View> & VariantProps<typeof itemGroupVariants>;

function ItemGroup({ className, variant, ...props }: ItemGroupProps) {
  return <View className={cn(itemGroupVariants({ variant }), className)} {...props} />;
}

type ItemSeparatorProps = {
  className?: string;
  /**
   * When true, indents the rule with horizontal `px-4` so it lines up with row content
   * (`Item` already has `px-4`. Use this only for legacy layouts where the group
   * had outer padding). Default is full-width edge-to-edge inside the group.
   */
  inset?: boolean;
};

function ItemSeparator({ className, inset }: ItemSeparatorProps) {
  return (
    <View className={cn('w-full', inset && 'px-4', className)} accessibilityRole="none">
      <Separator orientation="horizontal" decorative />
    </View>
  );
}

/** Optional section label above an `ItemGroup`. Matches `Item` horizontal padding (`px-4`) so it aligns with row content. */
function ItemHeader({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      variant="labelSmall"
      className={cn('px-4 text-muted-foreground pb-1 pt-2', className)}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text variant="paragraphSmall" className={cn('text-muted-foreground pt-1', className)} {...props} />
  );
}

/** @deprecated Use `Item` with `size="sm"` */
const ListItem = Item;
const ListItemLeading = ItemMedia;
const ListItemContent = ItemContent;
const ListItemTitle = ItemTitle;
const ListItemDescription = ItemDescription;
const ListItemTrailing = ItemActions;
const ListItemTrailingText = ItemValueText;
const ListItemTrailingStack = ItemValueStack;

export {
  Item,
  itemGroupVariants,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  itemMediaVariants,
  itemMediaVariants as listItemLeadingVariants,
  ItemMedia,
  ItemSeparator,
  itemVariants,
  itemVariants as listItemVariants,
  ItemTitle,
  ItemValueStack,
  ItemValueText,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemLeading,
  ListItemTrailing,
  ListItemTrailingStack,
  ListItemTrailingText,
  ListItemTitle,
};

export type { ItemGroupProps, ItemProps, ItemSeparatorProps, ItemValueTextProps };

/** @deprecated Use `ItemProps` */
export type ListItemProps = ItemProps;
/** @deprecated Use `ItemValueTextProps` */
export type ListItemTrailingTextProps = ItemValueTextProps;
