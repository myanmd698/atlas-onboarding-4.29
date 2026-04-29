import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Badge } from '~/components/ui/badge';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Badge',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'brand', 'outline'],
    },
    label: { control: 'text', description: 'Badge label' },
  },
  args: {
    storybookControls: false,
    variant: 'default',
    label: 'Badge',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View>
          <Badge variant="default">
            <Text>Default</Text>
          </Badge>
        </View>
  ),
};

export const Secondary: Story = {
  render: (_args) => (
    <View>
          <Badge variant="secondary">
            <Text>Secondary</Text>
          </Badge>
        </View>
  ),
};

export const Destructive: Story = {
  render: (_args) => (
    <View>
          <Badge variant="destructive">
            <Text>Destructive</Text>
          </Badge>
        </View>
  ),
};

export const Brand: Story = {
  render: (_args) => (
    <View>
          <Badge variant="brand">
            <Text>New</Text>
          </Badge>
        </View>
  ),
};

export const Outline: Story = {
  render: (_args) => (
    <View>
          <Badge variant="outline">
            <Text>Outline</Text>
          </Badge>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    label: 'Badge',
  },
  render: (args) => {
    const { storybookControls, label, ...badgeArgs } = args;
    return (
      <View>
        <Badge {...badgeArgs}>
          <Text>{String(label)}</Text>
        </Badge>
      </View>
    );
  },
};
