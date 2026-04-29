import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Text',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Text,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'displayLarge',
        'displayMedium',
        'displaySmall',
        'displayXSmall',
        'figureDisplay',
        'figureLarge',
        'figureMedium',
        'figureSmall',
        'figureXSmall',
        'headingXXLarge',
        'headingXLarge',
        'headingLarge',
        'headingMedium',
        'headingSmall',
        'headingXSmall',
        'labelLarge',
        'labelMedium',
        'labelSmall',
        'labelSmallSemibold',
        'labelXSmall',
        'paragraphLarge',
        'paragraphMedium',
        'paragraphSmall',
        'paragraphXSmall',
      ],
    },
    label: { control: 'text', description: 'Text content' },
  },
  args: {
    storybookControls: false,
    variant: 'paragraphMedium',
    label: 'The quick brown fox jumps over the lazy dog.',
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: (_args) => (
    <View className="max-w-xl gap-4">
      <Text variant="displayLarge">Display Large</Text>
      <Text variant="displayMedium">Display Medium</Text>
      <Text variant="displaySmall">Display Small</Text>
      <Text variant="displayXSmall">Display XSmall</Text>
      <Text variant="figureDisplay">$681,392 · figureDisplay (Figtree)</Text>
      <Text variant="figureLarge">$681,392 · figureLarge</Text>
      <Text variant="figureMedium">$681,392 · figureMedium</Text>
      <Text variant="figureSmall">$681,392 · figureSmall</Text>
      <Text variant="figureXSmall">$5,800 · figureXSmall</Text>
      <Text variant="headingXXLarge">Heading XXLarge</Text>
      <Text variant="headingXLarge">Heading XLarge</Text>
      <Text variant="headingLarge">Heading Large</Text>
      <Text variant="headingMedium">Heading Medium</Text>
      <Text variant="headingSmall">Heading Small</Text>
      <Text variant="headingXSmall">Heading XSmall</Text>
      <Text variant="labelLarge">Label Large</Text>
      <Text variant="labelMedium">Label Medium</Text>
      <Text variant="labelSmall">Label Small</Text>
      <Text variant="labelSmallSemibold">Label Small Semibold</Text>
      <Text variant="labelXSmall">Label XSmall</Text>
      <Text variant="paragraphLarge">Paragraph Large</Text>
      <Text variant="paragraphMedium">Paragraph Medium (default)</Text>
      <Text variant="paragraphSmall">Paragraph Small</Text>
      <Text variant="paragraphXSmall">Paragraph XSmall</Text>
      <Text variant="paragraphSmall" className="text-muted-foreground">
        Secondary line: color via className
      </Text>
      <Text variant="paragraphMedium" className="font-mono">
        Paragraph Medium + font-mono
      </Text>
      <Text>Implicit paragraphMedium</Text>
    </View>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'paragraphMedium',
    label: 'The quick brown fox jumps over the lazy dog.',
  },
  render: (args) => {
    const { storybookControls, label, ...textArgs } = args;
    return (
      <View className="max-w-xl">
        <Text {...textArgs}>{String(label)}</Text>
      </View>
    );
  },
};
