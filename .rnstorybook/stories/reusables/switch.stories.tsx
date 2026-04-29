import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Switch',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Switch,
  argTypes: {
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultChecked: false,
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="flex-row items-center gap-2">
          <Switch id="sw1" />
          <Label htmlFor="sw1">
            <Text>Off</Text>
          </Label>
        </View>
  ),
};

export const Checked: Story = {
  render: (_args) => (
    <View className="flex-row items-center gap-2">
          <Switch id="sw2" defaultChecked />
          <Label htmlFor="sw2">
            <Text>On</Text>
          </Label>
        </View>
  ),
};

export const Disabled: Story = {
  render: (_args) => (
    <View className="flex-row items-center gap-2">
          <Switch id="sw3" disabled />
          <Label htmlFor="sw3" className="opacity-50">
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
    const { storybookControls, ...swArgs } = args;
    return (
      <View className="flex-row items-center gap-2">
        <Switch id="sw-pg" {...swArgs} />
        <Label htmlFor="sw-pg">
          <Text>Airplane mode</Text>
        </Label>
      </View>
    );
  },
};
