import type { Meta, StoryObj } from '@storybook/react-native';
import { Mail } from 'lucide-react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';

const onDemoPress = fn();

function ButtonVariantsDemo() {
  return (
    <View className="w-full max-w-xl gap-8 self-stretch">
      <View className="gap-3">
        <Text className="text-muted-foreground text-xs font-medium uppercase">Variants</Text>
        <View className="flex-row flex-wrap gap-2">
          <Button variant="default" onPress={onDemoPress}>
            <Text>Default</Text>
          </Button>
          <Button variant="brand" onPress={onDemoPress}>
            <Text>Brand</Text>
          </Button>
          <Button variant="secondary" onPress={onDemoPress}>
            <Text>Secondary</Text>
          </Button>
          <Button variant="destructive" onPress={onDemoPress}>
            <Text>Destructive</Text>
          </Button>
          <Button variant="outline" onPress={onDemoPress}>
            <Text>Outline</Text>
          </Button>
          <Button variant="ghost" onPress={onDemoPress}>
            <Text>Ghost</Text>
          </Button>
          <Button variant="link" onPress={onDemoPress}>
            <Text>Link</Text>
          </Button>
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-muted-foreground text-xs font-medium uppercase">Sizes</Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <Button size="sm" onPress={onDemoPress}>
            <Text>Small</Text>
          </Button>
          <Button size="default" onPress={onDemoPress}>
            <Text>Default</Text>
          </Button>
          <Button size="lg" onPress={onDemoPress}>
            <Text>Large</Text>
          </Button>
          <Button size="icon" variant="outline" accessibilityLabel="Email" onPress={onDemoPress}>
            <Icon as={Mail} />
          </Button>
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-muted-foreground text-xs font-medium uppercase">With icon</Text>
        <View className="flex-row flex-wrap gap-2">
          <Button onPress={onDemoPress}>
            <Icon as={Mail} />
            <Text>Login with email</Text>
          </Button>
          <Button variant="outline" onPress={onDemoPress}>
            <Icon as={Mail} />
            <Text>Outline + icon</Text>
          </Button>
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-muted-foreground text-xs font-medium uppercase">Disabled</Text>
        <View className="flex-row flex-wrap gap-2">
          <Button disabled onPress={onDemoPress}>
            <Text>Disabled</Text>
          </Button>
          <Button variant="outline" disabled onPress={onDemoPress}>
            <Text>Disabled outline</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const meta = {
  title: 'Components/ButtonVariants',
  component: ButtonVariantsDemo,
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ButtonVariantsDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => <ButtonVariantsDemo />,
};
