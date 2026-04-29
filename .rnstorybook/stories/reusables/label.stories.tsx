import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Label',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Label,
  argTypes: {
    labelText: { control: 'text', description: 'Visible label' },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    labelText: 'Email',
    disabled: false,
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs gap-2">
          <Label nativeID="email">
            <Text>Email</Text>
          </Label>
          <Input nativeID="email" placeholder="you@example.com" />
        </View>
  ),
};

export const Playground: Story = {
  args: {
    labelText: 'Email',
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, labelText, ...labelArgs } = args;
    return (
      <View className="w-full max-w-xs gap-2">
        <Label nativeID="email-label" {...labelArgs}>
          <Text>{String(labelText)}</Text>
        </Label>
        <Input nativeID="email-label" placeholder="you@example.com" />
      </View>
    );
  },
};
