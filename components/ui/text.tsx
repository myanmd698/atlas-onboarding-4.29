import { cn } from '~/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

/**
 * Semantic typography aligned with Base Web (`Paragraph*`, `Label*`, `Heading*`, `Display*`).
 * Default stack is `font-sans` (Figtree in this app); use `className` (e.g. `font-mono`) for monospace.
 * **`figure*`** variants: same scale as adjacent headings but always Figtree + `tabular-nums` for money and metrics.
 * Heading/display variants use the serif stack for titles; do not use them for primary numeric values.
 * Do not add `font-*` weight utilities on `<Text variant={…} />`. Pick another variant or extend `textVariants`.
 * @see https://github.com/uber/baseweb/blob/master/src/themes/shared/typography.ts
 */
const textVariants = cva(
  cn('font-sans text-foreground', Platform.select({ web: 'select-text' })),
  {
    variants: {
      variant: {
        paragraphXSmall: 'text-[12px] font-normal leading-[20px]',
        paragraphSmall: 'text-[14px] font-normal leading-[20px]',
        paragraphMedium: 'text-[16px] font-normal leading-[24px]',
        paragraphLarge: 'text-[18px] font-normal leading-[28px]',
        labelXSmall: 'text-[12px] font-sans-medium font-normal leading-[16px]',
        labelSmall: 'text-[14px] font-sans-medium font-normal leading-[16px]',
        /** Same size as `labelSmall`; semibold face only. Do not add `font-normal` or it wins over `font-sans-semibold` on native. */
        labelSmallSemibold: 'text-[14px] font-sans-semibold leading-[16px]',
        labelMedium: 'text-[16px] font-sans-medium font-normal leading-[20px]',
        labelLarge: 'text-[18px] font-sans-medium font-normal leading-[24px]',
        headingXSmall: cn(
          'text-[20px] font-serif leading-[28px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        headingSmall: cn(
          'text-[24px] font-serif leading-[32px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        headingMedium: cn(
          'text-[28px] font-serif leading-[36px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        headingLarge: cn(
          'text-[32px] font-serif leading-[40px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        headingXLarge: cn(
          'text-[36px] font-serif leading-[44px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        headingXXLarge: cn(
          'text-[40px] font-serif leading-[52px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        displayXSmall: cn(
          'text-[36px] font-serif leading-[44px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        displaySmall: cn(
          'text-[44px] font-serif leading-[52px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        displayMedium: cn(
          'text-[52px] font-serif leading-[64px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        displayLarge: cn(
          'text-[96px] font-serif leading-[112px]',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        /** Figtree: monetary / metric emphasis (matches nearby heading scale, not semantic headings). */
        figureXSmall: cn(
          'text-[20px] font-sans-semibold leading-[28px] tabular-nums',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        figureSmall: cn(
          'text-[24px] font-sans-semibold leading-[32px] tabular-nums',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        figureMedium: cn(
          'text-[28px] font-sans-semibold leading-[36px] tabular-nums',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        figureLarge: cn(
          'text-[32px] font-sans-bold leading-[40px] tabular-nums',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
        figureDisplay: cn(
          'text-[36px] font-sans-bold leading-[44px] tabular-nums',
          Platform.select({ web: 'scroll-m-20 tracking-tight' })
        ),
      },
    },
    defaultVariants: {
      variant: 'paragraphMedium',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

export type TextVariant = NonNullable<TextVariantProps['variant']>;

const HEADING_LEVEL: Partial<Record<TextVariant, string>> = {
  headingXSmall: '6',
  headingSmall: '5',
  headingMedium: '4',
  headingLarge: '3',
  headingXLarge: '2',
  headingXXLarge: '1',
};

const DISPLAY_VARIANTS = new Set<TextVariant>([
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'displayXSmall',
]);

function headingRole(variant: TextVariant): Role | undefined {
  if (variant.startsWith('figure')) return undefined;
  if (variant.startsWith('heading')) return 'heading';
  if (DISPLAY_VARIANTS.has(variant)) return 'heading';
  return undefined;
}

function ariaLevelFor(variant: TextVariant): string | undefined {
  const h = HEADING_LEVEL[variant];
  if (h) return h;
  if (DISPLAY_VARIANTS.has(variant)) return '1';
  return undefined;
}

const TextClassContext = React.createContext<string | undefined>(undefined);

/** When true, nested `Text` uses only `TextClassContext` (e.g. `Button` label styles) and skips default `variant` typography so `paragraphMedium` does not fight `labelSmallSemibold`. */
const ButtonTypographyContext = React.createContext(false);

function Text({
  className,
  asChild = false,
  variant = 'paragraphMedium',
  ...props
}: React.ComponentProps<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const insideButtonTypography = React.useContext(ButtonTypographyContext);
  const v = variant as TextVariant;
  const Component = asChild ? Slot.Text : RNText;

  const baseClass =
    insideButtonTypography && textClass
      ? textClass
      : cn(textVariants({ variant }), textClass);

  return (
    <Component
      className={cn(baseClass, className)}
      role={headingRole(v)}
      aria-level={ariaLevelFor(v)}
      {...props}
    />
  );
}

export { ButtonTypographyContext, Text, TextClassContext, textVariants };
