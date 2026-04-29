import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Separator } from '~/components/ui/separator';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Separator',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Separator,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  args: {
    storybookControls: false,
    orientation: 'horizontal',
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (_args) => (
    <View className="gap-2">
          <Text>Above</Text>
          <Separator orientation="horizontal" />
          <Text>Below</Text>
        </View>
  ),
};

export const Vertical: Story = {
  render: (_args) => (
    <View className="h-24 flex-row items-stretch gap-3">
          <Text>Left</Text>
          <Separator orientation="vertical" />
          <Text>Right</Text>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => {
    const { storybookControls, ...sepArgs } = args;
    return (
      <View className="gap-2">
        <Text>Above</Text>
        <Separator {...sepArgs} />
        <Text>Below</Text>
      </View>
    );
  },
};
