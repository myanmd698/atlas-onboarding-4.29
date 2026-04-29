import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Tabs',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Tabs,
  argTypes: {
    defaultValue: { control: 'select', options: ['one', 'two'] },
  },
  args: {
    storybookControls: false,
    defaultValue: 'one',
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Tabs defaultValue="one" className="w-full max-w-sm">
          <TabsList>
            <TabsTrigger value="one">
              <Text>One</Text>
            </TabsTrigger>
            <TabsTrigger value="two">
              <Text>Two</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="one">
            <Text className="text-muted-foreground text-sm">Tab one</Text>
          </TabsContent>
          <TabsContent value="two">
            <Text className="text-muted-foreground text-sm">Tab two</Text>
          </TabsContent>
        </Tabs>
  ),
};

export const Playground: Story = {
  args: {
    defaultValue: 'one',
  },
  render: (args) => {
    const { storybookControls, defaultValue, ...rest } = args;
    return (
      <Tabs defaultValue={defaultValue} className="w-full max-w-sm" {...rest}>
        <TabsList>
          <TabsTrigger value="one">
            <Text>One</Text>
          </TabsTrigger>
          <TabsTrigger value="two">
            <Text>Two</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one">
          <Text className="text-muted-foreground text-sm">Tab one</Text>
        </TabsContent>
        <TabsContent value="two">
          <Text className="text-muted-foreground text-sm">Tab two</Text>
        </TabsContent>
      </Tabs>
    );
  },
};
