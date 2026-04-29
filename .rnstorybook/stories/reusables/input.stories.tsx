import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Input } from '~/components/ui/input';

const meta = {
  title: 'Components/Input',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Input,
  argTypes: {
    placeholder: { control: 'text' },
    editable: { control: 'boolean', description: 'When false, field is read-only / disabled styling' },
  },
  args: {
    storybookControls: false,
    placeholder: 'Email',
    editable: true,
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs">
          <Input placeholder="Email" />
        </View>
  ),
};

export const Disabled: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs">
          <Input placeholder="Email" editable={false} value="disabled@example.com" />
        </View>
  ),
};

export const Playground: Story = {
  args: {
    placeholder: 'Email',
    editable: true,
  },
  render: (args) => {
    const { storybookControls, ...inputArgs } = args;
    return (
      <View className="w-full max-w-xs">
        <Input {...inputArgs} />
      </View>
    );
  },
};
