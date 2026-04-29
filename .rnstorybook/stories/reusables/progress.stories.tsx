import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Progress',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Progress,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  args: {
    storybookControls: false,
    value: 50,
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Value10: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs gap-1 py-2">
      <Progress value={10} />
      <Text className="text-muted-foreground text-xs">10%</Text>
    </View>
  ),
};

export const Value33: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs gap-1 py-2">
          <Progress value={33} />
          <Text className="text-muted-foreground text-xs">33%</Text>
        </View>
  ),
};

export const Value66: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs gap-1 py-2">
          <Progress value={66} />
          <Text className="text-muted-foreground text-xs">66%</Text>
        </View>
  ),
};

export const Value100: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs gap-1 py-2">
          <Progress value={100} />
          <Text className="text-muted-foreground text-xs">100%</Text>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    value: 50,
  },
  render: (args) => {
    const { storybookControls, ...rest } = args;
    return (
      <View className="w-full max-w-xs gap-1 py-2">
        <Progress {...rest} />
        <Text className="text-muted-foreground text-xs">Drag value (0–100)</Text>
      </View>
    );
  },
};
