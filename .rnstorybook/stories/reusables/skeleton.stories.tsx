import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Skeleton } from '~/components/ui/skeleton';

const meta = {
  title: 'Components/Skeleton',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Skeleton,
  argTypes: {
    barClass: { control: 'text', description: 'First row className' },
    lineClass: { control: 'text', description: 'Second row className' },
  },
  args: {
    storybookControls: false,
    barClass: 'h-12 w-full rounded-md',
    lineClass: 'h-4 w-2/3 rounded-md',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="gap-2">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </View>
  ),
};

export const Playground: Story = {
  args: {
    barClass: 'h-12 w-full rounded-md',
    lineClass: 'h-4 w-2/3 rounded-md',
  },
  render: (args) => {
    const { storybookControls, barClass, lineClass } = args;
    return (
      <View className="gap-2">
        <Skeleton className={String(barClass)} />
        <Skeleton className={String(lineClass)} />
      </View>
    );
  },
};
