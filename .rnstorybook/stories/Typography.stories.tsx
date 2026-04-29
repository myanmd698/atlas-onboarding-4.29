import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

type TextVariant = NonNullable<React.ComponentProps<typeof Text>['variant']>;

/**
 * All `variant` values on `~/components/ui/text`, plus numeric specs aligned with Base Web typography
 * (Uber Base: sizes, line heights, weights; font family stays the app stack).
 */
const ROWS: {
  name: string;
  variant: TextVariant;
  preview: string;
  /** Pixel sizes / line-height / weight; no “Size:” prefixes. */
  specs: string;
}[] = [
  // Display (largest → smallest)
  {
    name: 'displayLarge',
    variant: 'displayLarge',
    preview: 'Display Large',
    specs: '96px / 112px · bold · 700',
  },
  {
    name: 'displayMedium',
    variant: 'displayMedium',
    preview: 'Display Medium',
    specs: '52px / 64px · bold · 700',
  },
  {
    name: 'displaySmall',
    variant: 'displaySmall',
    preview: 'Display Small',
    specs: '44px / 52px · bold · 700',
  },
  {
    name: 'displayXSmall',
    variant: 'displayXSmall',
    preview: 'Display XSmall',
    specs: '36px / 44px · bold · 700',
  },
  // Heading (largest → smallest)
  {
    name: 'headingXXLarge',
    variant: 'headingXXLarge',
    preview: 'Heading XXLarge',
    specs: '40px / 52px · bold · 700',
  },
  {
    name: 'headingXLarge',
    variant: 'headingXLarge',
    preview: 'Heading XLarge',
    specs: '36px / 44px · bold · 700',
  },
  {
    name: 'headingLarge',
    variant: 'headingLarge',
    preview: 'Heading Large',
    specs: '32px / 40px · bold · 700',
  },
  {
    name: 'headingMedium',
    variant: 'headingMedium',
    preview: 'Heading Medium',
    specs: '28px / 36px · bold · 700',
  },
  {
    name: 'headingSmall',
    variant: 'headingSmall',
    preview: 'Heading Small',
    specs: '24px / 32px · bold · 700',
  },
  {
    name: 'headingXSmall',
    variant: 'headingXSmall',
    preview: 'Heading XSmall',
    specs: '20px / 28px · bold · 700',
  },
  // Label (largest → smallest)
  {
    name: 'labelLarge',
    variant: 'labelLarge',
    preview: 'Label Large',
    specs: '18px / 24px · medium · 500',
  },
  {
    name: 'labelMedium',
    variant: 'labelMedium',
    preview: 'Label Medium',
    specs: '16px / 20px · medium · 500',
  },
  {
    name: 'labelSmall',
    variant: 'labelSmall',
    preview: 'Label Small',
    specs: '14px / 16px · medium · 500',
  },
  {
    name: 'labelXSmall',
    variant: 'labelXSmall',
    preview: 'Label XSmall',
    specs: '12px / 16px · medium · 500',
  },
  // Paragraph (largest → smallest)
  {
    name: 'paragraphLarge',
    variant: 'paragraphLarge',
    preview: 'Paragraph Large',
    specs: '18px / 28px · normal · 400',
  },
  {
    name: 'paragraphMedium',
    variant: 'paragraphMedium',
    preview: 'Paragraph Medium (default)',
    specs: '16px / 24px · normal · 400',
  },
  {
    name: 'paragraphSmall',
    variant: 'paragraphSmall',
    preview: 'Paragraph Small',
    specs: '14px / 20px · normal · 400',
  },
  {
    name: 'paragraphXSmall',
    variant: 'paragraphXSmall',
    preview: 'Paragraph XSmall',
    specs: '12px / 20px · normal · 400',
  },
];

function TypographyTableDemo() {
  return (
    <View className="w-full max-w-6xl gap-4 self-stretch">
      <View className="gap-1">
        <Text variant="headingMedium">Typography</Text>
        <Text variant="paragraphSmall" className="text-muted-foreground leading-5">
          These samples use the shared{' '}
          <Text variant="paragraphXSmall" className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono">
            Text
          </Text>{' '}
          component and its{' '}
          <Text variant="paragraphXSmall" className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono">
            variant
          </Text>{' '}
          prop. Classes are defined once in components/ui/text (CVA + NativeWind). Base Web numeric
          specs; add{' '}
          <Text variant="paragraphXSmall" className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono">
            font-mono
          </Text>{' '}
          for monospace (Base Mono* uses the same sizes as the matching variant).
        </Text>
      </View>

      <View className="overflow-hidden rounded-lg border border-border">
        <View className="flex-row gap-3 border-b border-border bg-muted/50 px-3 py-3">
          <Text variant="labelSmall" className="w-44 shrink-0 font-semibold">
            Name
          </Text>
          <View className="min-w-0 flex-1">
            <Text variant="labelSmall" className="font-semibold">
              Preview
            </Text>
          </View>
          <Text variant="labelSmall" className="w-56 shrink-0 font-semibold">
            Specs
          </Text>
        </View>
        {ROWS.map((row) => (
          <View
            key={row.name}
            className="flex-row items-start gap-3 border-b border-border px-3 py-5 last:border-b-0">
            <Text variant="paragraphXSmall" className="w-44 shrink-0 font-mono text-muted-foreground text-xs">
              {row.name}
            </Text>
            <View className="min-w-0 flex-1">
              <Text variant={row.variant} className="mt-0">
                {row.preview}
              </Text>
            </View>
            <View className="w-56 shrink-0">
              <Text variant="paragraphXSmall" className="text-[11px] font-mono leading-snug text-muted-foreground">
                {row.specs}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const meta = {
  title: 'Foundations/Typography',
  component: TypographyTableDemo,
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TypographyTableDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => <TypographyTableDemo />,
};
