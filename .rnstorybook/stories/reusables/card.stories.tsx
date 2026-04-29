import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Card',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Card,
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'fill', 'highlight'],
      description: 'outline: default; fill: muted; highlight: brand-50 + brand-300 border (dark: 950/700)',
    },
    title: { control: 'text' },
    description: { control: 'text' },
    bodyText: { control: 'text', description: 'Main card body copy' },
  },
  args: {
    storybookControls: false,
    variant: 'outline',
    title: 'Card title',
    description: 'Description text.',
    bodyText: 'Content area.',
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Card variant="outline" className="self-stretch w-full max-w-6xl">
          <CardHeader>
            <CardTitle>Card</CardTitle>
            <CardDescription>Description text.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text variant="paragraphSmall" className="text-muted-foreground">
              Content area.
            </Text>
          </CardContent>
          <CardFooter className="flex-row gap-2">
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
            <Button>
              <Text>OK</Text>
            </Button>
          </CardFooter>
        </Card>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'outline',
    title: 'Card title',
    description: 'Description text.',
    bodyText: 'Content area.',
  },
  render: (args) => {
    const { storybookControls, title, description, bodyText, variant, ...cardRest } = args;
    return (
      <Card variant={variant} className="self-stretch w-full max-w-6xl" {...cardRest}>
        <CardHeader>
          <CardTitle>{String(title)}</CardTitle>
          <CardDescription>{String(description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Text variant="paragraphSmall" className="text-muted-foreground">
            {String(bodyText)}
          </Text>
        </CardContent>
        <CardFooter className="flex-row gap-2">
          <Button variant="outline">
            <Text>Cancel</Text>
          </Button>
          <Button>
            <Text>OK</Text>
          </Button>
        </CardFooter>
      </Card>
    );
  },
};
