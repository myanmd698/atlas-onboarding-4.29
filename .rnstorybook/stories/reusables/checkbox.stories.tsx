import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Checkbox',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Checkbox,
  argTypes: {
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultChecked: false,
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="flex-row items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">
            <Text>Accept terms</Text>
          </Label>
        </View>
  ),
};

export const Checked: Story = {
  render: (_args) => (
    <View className="flex-row items-center gap-2">
          <Checkbox id="terms2" defaultChecked />
          <Label htmlFor="terms2">
            <Text>Checked by default</Text>
          </Label>
        </View>
  ),
};

export const Disabled: Story = {
  render: (_args) => (
    <View className="flex-row items-center gap-2">
          <Checkbox id="terms3" disabled />
          <Label htmlFor="terms3" className="opacity-50">
            <Text>Disabled</Text>
          </Label>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    defaultChecked: false,
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, ...boxArgs } = args;
    return (
      <View className="flex-row items-center gap-2">
        <Checkbox id="terms-pg" {...boxArgs} />
        <Label htmlFor="terms-pg">
          <Text>Accept terms</Text>
        </Label>
      </View>
    );
  },
};
