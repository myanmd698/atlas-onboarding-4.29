import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Dialog',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Dialog,
  argTypes: {
    defaultOpen: { control: 'boolean' },
    titleText: { control: 'text' },
    descriptionText: { control: 'text' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
    titleText: 'Dialog title',
    descriptionText: 'Dialog description goes here.',
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Dialog defaultOpen={false}>
          <DialogTrigger asChild>
            <Button>
              <Text>Open dialog</Text>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>Dialog description goes here.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
  ),
};

export const Playground: Story = {
  args: {
    defaultOpen: false,
    titleText: 'Dialog title',
    descriptionText: 'Dialog description goes here.',
  },
  render: (args) => {
    const { storybookControls, titleText, descriptionText, defaultOpen, ...rest } = args;
    return (
      <Dialog defaultOpen={defaultOpen} {...rest}>
        <DialogTrigger asChild>
          <Button>
            <Text>Open dialog</Text>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{String(titleText)}</DialogTitle>
            <DialogDescription>{String(descriptionText)}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  },
};
