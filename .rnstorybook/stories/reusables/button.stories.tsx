import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { Loader2, Mail } from 'lucide-react-native';

const meta = {
  title: 'Components/Button',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    variant: 'default',
    size: 'default',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (_args) => (
    <View>
          <Button>
            <Text>Primary</Text>
          </Button>
        </View>
  ),
};

export const Secondary: Story = {
  render: (_args) => (
    <View>
          <Button variant="secondary">
            <Text>Secondary</Text>
          </Button>
        </View>
  ),
};

export const Brand: Story = {
  render: (_args) => (
    <View>
          <Button variant="brand">
            <Text>Brand</Text>
          </Button>
        </View>
  ),
};

export const Destructive: Story = {
  render: (_args) => (
    <View>
          <Button variant="destructive">
            <Text>Destructive</Text>
          </Button>
        </View>
  ),
};

export const Outline: Story = {
  render: (_args) => (
    <View>
          <Button variant="outline">
            <Text>Outline</Text>
          </Button>
        </View>
  ),
};

export const Ghost: Story = {
  render: (_args) => (
    <View>
          <Button variant="ghost">
            <Text>Ghost</Text>
          </Button>
        </View>
  ),
};

export const Link: Story = {
  render: (_args) => (
    <View>
          <Button variant="link">
            <Text>Link</Text>
          </Button>
        </View>
  ),
};

export const IconOnly: Story = {
  render: (_args) => (
    <View>
          <Button size="icon" variant="outline" accessibilityLabel="Email">
            <Icon as={Mail} />
          </Button>
        </View>
  ),
};

export const WithIcon: Story = {
  render: (_args) => (
    <View>
          <Button>
            <Icon as={Mail} />
            <Text>Login with Email</Text>
          </Button>
        </View>
  ),
};

export const Loading: Story = {
  render: (_args) => (
    <View>
          <Button disabled>
            <Icon as={Loader2} className="animate-spin text-primary-foreground" />
            <Text>Please wait</Text>
          </Button>
        </View>
  ),
};

export const Sizes: Story = {
  render: (_args) => (
    <View className="flex-row flex-wrap items-center gap-2">
          <Button size="sm">
            <Text>Small</Text>
          </Button>
          <Button size="default">
            <Text>Default</Text>
          </Button>
          <Button size="lg">
            <Text>Large</Text>
          </Button>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, ...buttonArgs } = args;
    return (
      <View>
        <Button {...buttonArgs}>
          <Text>Button</Text>
        </Button>
      </View>
    );
  },
};
