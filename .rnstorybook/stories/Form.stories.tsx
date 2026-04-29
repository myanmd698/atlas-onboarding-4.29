import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Form } from './Form';

const meta = {
  title: 'Patterns/Form',
  component: Form,
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
