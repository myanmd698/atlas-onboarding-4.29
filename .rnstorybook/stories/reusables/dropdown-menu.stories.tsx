import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/DropdownMenu',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: DropdownMenu,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <DropdownMenu defaultOpen={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>Open menu</Text>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Text>Profile</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Text>Settings</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  ),
};

export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <DropdownMenu defaultOpen={defaultOpen} {...rest}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Text>Open menu</Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Text>Profile</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Settings</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
