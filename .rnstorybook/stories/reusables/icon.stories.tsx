import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Icon } from '~/components/ui/icon';
import { Heart } from 'lucide-react-native';

const meta = {
  title: 'Components/Icon',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Icon,
  argTypes: {
    className: { control: 'text', description: 'NativeWind classes (e.g. text-primary size-8)' },
  },
  args: {
    storybookControls: false,
    className: 'text-primary size-8',
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Icon as={Heart} className="text-primary size-8" />
  ),
};

export const Playground: Story = {
  args: {
    className: 'text-primary size-8',
  },
  render: (args) => {
    const { storybookControls, className } = args;
    return <Icon as={Heart} className={String(className)} />;
  },
};
