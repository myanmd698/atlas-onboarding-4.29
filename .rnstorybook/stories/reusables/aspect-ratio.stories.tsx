import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/AspectRatio',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: AspectRatio,
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.25, max: 3, step: 0.05 },
      description: 'Width ÷ height (e.g. 1.778 ≈ 16:9)',
    },
  },
  args: {
    storybookControls: false,
    ratio: 16 / 9,
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="w-72 p-2">
          <AspectRatio ratio={16 / 9}>
            <View className="bg-muted w-full items-center justify-center rounded-md">
              <Text className="text-muted-foreground text-sm">16:9</Text>
            </View>
          </AspectRatio>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => {
    const { storybookControls, ratio } = args;
    const r = Number(ratio ?? 16 / 9);
    return (
      <View className="w-72 p-2">
        <AspectRatio ratio={r}>
          <View className="bg-muted w-full items-center justify-center rounded-md">
            <Text className="text-muted-foreground text-sm">{r.toFixed(3)}</Text>
          </View>
        </AspectRatio>
      </View>
    );
  },
};
