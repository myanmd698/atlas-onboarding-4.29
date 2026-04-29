import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Popover',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Popover,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Text>Open popover</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Text className="text-sm">Popover content</Text>
          </PopoverContent>
        </Popover>
  ),
};

export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <Popover defaultOpen={defaultOpen} {...rest}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Text>Open popover</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Text className="text-sm">Popover content</Text>
        </PopoverContent>
      </Popover>
    );
  },
};
