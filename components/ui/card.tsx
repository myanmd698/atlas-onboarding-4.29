import { Text, TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View } from 'react-native';

const cardVariants = cva('flex flex-col gap-6 rounded-xl border py-4 md:py-6', {
    variants: {
      /**
       * `outline`: default card: surface + hairline border.
       * `fill`: soft filled surface, no visible border (muted block).
       * `highlight`: 2px brand border + light fill (50/300 light, 950/700 dark).
       */
      variant: {
        outline: cn(
          'border-border bg-card text-card-foreground shadow-sm shadow-black/5'
        ),
        fill: cn('border-transparent bg-muted text-card-foreground shadow-none'),
        highlight: cn(
          'border-2 border-brand-300 bg-brand-50 text-card-foreground shadow-sm shadow-black/5 dark:border-brand-700 dark:bg-brand-950'
        ),
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
);

type CardProps = React.ComponentProps<typeof View> &
  VariantProps<typeof cardVariants>;

function Card({ className, variant, ...props }: CardProps) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View className={cn(cardVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('flex flex-col gap-1.5 px-4 md:px-6', className)} {...props} />;
}

function CardTitle({
  className,
  variant = 'headingSmall',
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text variant={variant} className={cn('leading-none', className)} {...props} />
  );
}

function CardDescription({
  className,
  variant = 'paragraphSmall',
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text variant={variant} className={cn('text-muted-foreground', className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('px-4 md:px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('flex flex-row items-center px-4 md:px-6', className)} {...props} />;
}

export { Card, cardVariants, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export type { CardProps };
