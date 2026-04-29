import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle } from 'lucide-react-native';

const meta = {
  title: 'Components/Alert',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Alert,
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive'] },
  },
  args: {
    storybookControls: false,
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Alert icon={AlertCircle}>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Short supporting copy for the alert.</AlertDescription>
        </Alert>
  ),
};

export const Destructive: Story = {
  render: (_args) => (
    <Alert icon={AlertCircle} variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => {
    const { storybookControls, ...alertArgs } = args;
    return (
      <Alert icon={AlertCircle} {...alertArgs}>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Short supporting copy for the alert.</AlertDescription>
      </Alert>
    );
  },
};
