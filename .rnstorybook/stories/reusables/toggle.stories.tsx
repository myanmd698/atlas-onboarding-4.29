import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Toggle, ToggleIcon } from '~/components/ui/toggle';
import { Bold } from 'lucide-react-native';

const meta = {
  title: 'Components/Toggle',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Toggle,
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    variant: 'default',
    size: 'default',
    disabled: false,
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View>
          <Toggle aria-label="Toggle bold">
            <ToggleIcon as={Bold} />
          </Toggle>
        </View>
  ),
};

export const Outline: Story = {
  render: (_args) => (
    <View>
          <Toggle variant="outline" aria-label="Toggle bold">
            <ToggleIcon as={Bold} />
          </Toggle>
        </View>
  ),
};

export const Small: Story = {
  render: (_args) => (
    <View>
          <Toggle size="sm" aria-label="Toggle bold">
            <ToggleIcon as={Bold} />
          </Toggle>
        </View>
  ),
};

export const Large: Story = {
  render: (_args) => (
    <View>
          <Toggle size="lg" aria-label="Toggle bold">
            <ToggleIcon as={Bold} />
          </Toggle>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, ...tArgs } = args;
    return (
      <View>
        <Toggle aria-label="Toggle bold" {...tArgs}>
          <ToggleIcon as={Bold} />
        </Toggle>
      </View>
    );
  },
};
