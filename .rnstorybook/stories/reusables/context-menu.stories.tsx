import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/ContextMenu',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: ContextMenu,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <ContextMenu defaultOpen={false}>
          <ContextMenuTrigger>
            <View className="bg-muted rounded-md px-4 py-8">
              <Text className="text-center text-muted-foreground">Right-click (web) or long-press</Text>
            </View>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Text>Action</Text>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text>Another</Text>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
  ),
};

export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <ContextMenu defaultOpen={defaultOpen} {...rest}>
        <ContextMenuTrigger>
          <View className="bg-muted rounded-md px-4 py-8">
            <Text className="text-center text-muted-foreground">Right-click (web) or long-press</Text>
          </View>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Text>Action</Text>
          </ContextMenuItem>
          <ContextMenuItem>
            <Text>Another</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
