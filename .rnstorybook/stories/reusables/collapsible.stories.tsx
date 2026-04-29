import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Collapsible',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Collapsible,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Collapsible defaultOpen>
          <CollapsibleTrigger>
            <Text className="font-medium">Toggle</Text>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <View className="pt-2">
              <Text className="text-muted-foreground text-sm">Hidden content</Text>
            </View>
          </CollapsibleContent>
        </Collapsible>
  ),
};

export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <Collapsible defaultOpen={defaultOpen} {...rest}>
        <CollapsibleTrigger>
          <Text className="font-medium">Toggle</Text>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <View className="pt-2">
            <Text className="text-muted-foreground text-sm">Hidden content</Text>
          </View>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};
