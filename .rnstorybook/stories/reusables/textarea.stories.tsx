import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Textarea } from '~/components/ui/textarea';

const meta = {
  title: 'Components/Textarea',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    editable: { control: 'boolean', description: 'When false, read-only / disabled styling' },
  },
  args: {
    storybookControls: false,
    placeholder: 'Notes',
    editable: true,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs">
          <Textarea placeholder="Notes" numberOfLines={4} />
        </View>
  ),
};

export const Disabled: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs">
          <Textarea placeholder="Notes" numberOfLines={4} editable={false} value="Read-only content." />
        </View>
  ),
};

export const Playground: Story = {
  args: {
    placeholder: 'Notes',
    editable: true,
  },
  render: (args) => {
    const { storybookControls, ...taArgs } = args;
    return (
      <View className="w-full max-w-xs">
        <Textarea numberOfLines={4} {...taArgs} />
      </View>
    );
  },
};
