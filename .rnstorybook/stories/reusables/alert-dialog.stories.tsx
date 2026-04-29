import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/AlertDialog',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: AlertDialog,
  argTypes: {
    defaultOpen: { control: 'boolean' },
    titleText: { control: 'text' },
    descriptionText: { control: 'text' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
    titleText: 'Are you sure?',
    descriptionText: 'This action cannot be undone.',
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <AlertDialog defaultOpen={false}>
          <AlertDialogTrigger asChild>
            <Button>
              <Text>Open</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction>
                <Text>Continue</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
  ),
};

export const Playground: Story = {
  args: {
    defaultOpen: false,
    titleText: 'Are you sure?',
    descriptionText: 'This action cannot be undone.',
  },
  render: (args) => {
    const { storybookControls, titleText, descriptionText, defaultOpen, ...rest } = args;
    return (
      <AlertDialog defaultOpen={defaultOpen} {...rest}>
        <AlertDialogTrigger asChild>
          <Button>
            <Text>Open</Text>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{String(titleText)}</AlertDialogTitle>
            <AlertDialogDescription>{String(descriptionText)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};
