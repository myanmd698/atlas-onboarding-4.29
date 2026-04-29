import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

const meta = {
  title: 'Components/Tooltip',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Tooltip,
  argTypes: {
    delayDuration: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
  },
  args: {
    storybookControls: false,
    delayDuration: 200,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <View className="self-start rounded-md border border-border px-3 py-2">
              <Text>Hover me</Text>
            </View>
          </TooltipTrigger>
          <TooltipContent>
            <Text>Tooltip</Text>
          </TooltipContent>
        </Tooltip>
  ),
};

export const Playground: Story = {
  args: {
    delayDuration: 200,
  },
  render: (args) => {
    const { storybookControls, delayDuration, ...rest } = args;
    return (
      <Tooltip delayDuration={delayDuration} {...rest}>
        <TooltipTrigger asChild>
          <View className="self-start rounded-md border border-border px-3 py-2">
            <Text>Hover me</Text>
          </View>
        </TooltipTrigger>
        <TooltipContent>
          <Text>Tooltip</Text>
        </TooltipContent>
      </Tooltip>
    );
  },
};
