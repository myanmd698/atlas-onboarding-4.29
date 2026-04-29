import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/HoverCard',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: HoverCard,
  argTypes: {
    contentAlign: {
      control: 'select',
      options: ['center', 'start', 'end'],
      description: 'HoverCardContent align',
    },
  },
  args: {
    storybookControls: false,
    contentAlign: 'center',
  },
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <HoverCard>
          <HoverCardTrigger>
            <View className="self-start">
              <Text className="text-primary underline">@hover</Text>
            </View>
          </HoverCardTrigger>
          <HoverCardContent>
            <Text className="text-sm">Hover card body</Text>
          </HoverCardContent>
        </HoverCard>
  ),
};

export const Playground: Story = {
  args: {
    contentAlign: 'center',
  },
  render: (args) => {
    const { storybookControls, contentAlign, ...rest } = args;
    return (
      <HoverCard {...rest}>
        <HoverCardTrigger>
          <View className="self-start">
            <Text className="text-primary underline">@hover</Text>
          </View>
        </HoverCardTrigger>
        <HoverCardContent align={contentAlign}>
          <Text className="text-sm">Hover card body</Text>
        </HoverCardContent>
      </HoverCard>
    );
  },
};
