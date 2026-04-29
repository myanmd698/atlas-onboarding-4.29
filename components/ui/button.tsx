import { ButtonTypographyContext, TextClassContext, textVariants } from '~/components/ui/text';
import { hapticsImpactLight, hapticsImpactMedium, hapticsSelection } from '~/lib/haptics';
import { cn } from '~/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Pressable, type GestureResponderEvent } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:self-center",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary active:bg-primary/90 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-primary/90' })
        ),
        brand: cn(
          'bg-brand active:bg-brand/90 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-brand/90' })
        ),
        destructive: cn(
          'bg-destructive active:bg-destructive/90 dark:bg-destructive/60 shadow-sm shadow-black/5',
          Platform.select({
            web: 'hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
          })
        ),
        outline: cn(
          'border-border bg-background active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 border shadow-sm shadow-black/5',
          Platform.select({
            web: 'hover:bg-accent dark:hover:bg-input/50',
          })
        ),
        secondary: cn(
          'bg-secondary active:bg-secondary/80 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-secondary/80' })
        ),
        ghost: cn(
          'active:bg-accent dark:active:bg-accent/50',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' })
        ),
        link: '',
      },
      size: {
        default: cn('h-10 px-4 py-2 sm:h-9', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn('h-9 gap-1.5 rounded-md px-3 sm:h-8', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('h-11 rounded-md px-6 sm:h-10', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/** Inherits into nested `Text` via `TextClassContext`. Uses `labelSmallSemibold`; do not stack extra `font-*` here. */
const buttonTextVariants = cva(
  cn(
    textVariants({ variant: 'labelSmallSemibold' }),
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        brand: 'text-brand-foreground',
        destructive: 'text-destructive-foreground',
        outline: cn(
          'text-foreground',
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        secondary: 'text-secondary-foreground',
        ghost: cn(
          'text-foreground',
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        link: cn(
          'text-primary group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Color-only classes for `Icon` inside `Button`. Do not mix with full `buttonTextVariants`; label
 * typography (`text-[14px]`, `leading-*`, font weight) on SVG children misaligns and shrinks icons.
 */
const buttonIconTextVariants = cva(
  cn('leading-none', Platform.select({ web: 'pointer-events-none' })),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        brand: 'text-brand-foreground',
        destructive: 'text-destructive-foreground',
        outline: cn(
          'text-foreground',
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        secondary: 'text-secondary-foreground',
        ghost: cn(
          'text-foreground',
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        link: cn(
          'text-primary group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonIconContextValue = {
  iconClassName: string;
  buttonSize: NonNullable<VariantProps<typeof buttonVariants>['size']>;
};

export const ButtonIconContext = React.createContext<ButtonIconContextValue | null>(null);

type ButtonProps = React.ComponentProps<typeof Pressable> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, onPress, ...props }: ButtonProps) {
  const handlePress = React.useCallback(
    (e: GestureResponderEvent) => {
      if (Platform.OS !== 'web') {
        if (variant === 'destructive') {
          hapticsImpactMedium();
        } else if (variant === 'link' || variant === 'ghost') {
          hapticsSelection();
        } else {
          hapticsImpactLight();
        }
      }
      onPress?.(e);
    },
    [onPress, variant]
  );

  const resolvedSize = size ?? 'default';
  const iconContextValue = React.useMemo<ButtonIconContextValue>(
    () => ({
      iconClassName: buttonIconTextVariants({ variant, size: resolvedSize }),
      buttonSize: resolvedSize,
    }),
    [variant, resolvedSize]
  );

  return (
    <ButtonTypographyContext.Provider value={true}>
      <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
        <ButtonIconContext.Provider value={iconContextValue}>
          <Pressable
            className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size }), className)}
            role="button"
            onPress={onPress ? handlePress : undefined}
            {...props}
          />
        </ButtonIconContext.Provider>
      </TextClassContext.Provider>
    </ButtonTypographyContext.Provider>
  );
}

export { Button, buttonIconTextVariants, buttonTextVariants, buttonVariants };
export type { ButtonProps };
