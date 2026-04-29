import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Avatar',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Avatar,
  argTypes: {
    alt: { control: 'text', description: 'Accessibility label' },
    fallbackLabel: { control: 'text', description: 'Initials when image off' },
    showImage: { control: 'boolean', description: 'Load remote avatar image' },
  },
  args: {
    storybookControls: false,
    alt: 'User',
    fallbackLabel: 'CN',
    showImage: true,
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Avatar className="size-14" alt="User">
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          <AvatarFallback>
            <Text>CN</Text>
          </AvatarFallback>
        </Avatar>
  ),
};

export const Playground: Story = {
  args: {
    alt: 'User',
    fallbackLabel: 'CN',
    showImage: true,
  },
  render: (args) => {
    const { storybookControls, showImage, fallbackLabel, alt, ...rest } = args;
    return (
      <Avatar className="size-14" alt={String(alt)} {...rest}>
        {showImage ? <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} /> : null}
        <AvatarFallback>
          <Text>{String(fallbackLabel)}</Text>
        </AvatarFallback>
      </Avatar>
    );
  },
};
