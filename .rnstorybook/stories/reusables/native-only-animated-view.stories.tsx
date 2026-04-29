import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { NativeOnlyAnimatedView } from '~/components/ui/native-only-animated-view';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/NativeOnlyAnimatedView',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: NativeOnlyAnimatedView,
  argTypes: {
    className: { control: 'text', description: 'Wrapper classes' },
    caption: { control: 'text', description: 'Inner text' },
  },
  args: {
    storybookControls: false,
    className: 'rounded-md bg-muted p-4',
    caption: 'Internal primitive (animations)',
  },
} satisfies Meta<typeof NativeOnlyAnimatedView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <NativeOnlyAnimatedView className="rounded-md bg-muted p-4">
          <Text className="text-muted-foreground text-xs">Internal primitive (animations)</Text>
        </NativeOnlyAnimatedView>
  ),
};

export const Playground: Story = {
  args: {
    className: 'rounded-md bg-muted p-4',
    caption: 'Internal primitive (animations)',
  },
  render: (args) => {
    const { storybookControls, className, caption } = args;
    return (
      <NativeOnlyAnimatedView className={String(className)}>
        <Text className="text-muted-foreground text-xs">{String(caption)}</Text>
      </NativeOnlyAnimatedView>
    );
  },
};
