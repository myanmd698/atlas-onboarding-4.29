import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Page } from './Page';

const meta = {
  title: 'Patterns/Page',
  component: Page,
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col bg-background">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
