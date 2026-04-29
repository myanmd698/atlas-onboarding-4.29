import type { Meta, StoryObj } from '@storybook/react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';

function CardVariantsDemo() {
  return (
    <View className="w-full max-w-md gap-6 self-stretch">
      <View className="gap-2">
        <Text className="text-muted-foreground text-xs font-medium uppercase">Fill</Text>
        <Card variant="fill">
          <CardHeader className="gap-1">
            <CardTitle className="text-lg">Yearly subscription</CardTitle>
            <Text className="text-muted-foreground text-sm">with 14-day free trial</Text>
          </CardHeader>
          <CardContent className="flex-row items-end justify-between pt-0">
            <Text className="text-2xl font-semibold">$58.99</Text>
            <Badge variant="brand">
              <Text>38% off</Text>
            </Badge>
          </CardContent>
        </Card>
      </View>

      <View className="gap-2">
        <Text className="text-muted-foreground text-xs font-medium uppercase">Outline</Text>
        <Card variant="outline">
          <CardHeader className="relative gap-2">
            <View className="absolute right-4 top-4 size-5 rounded-full border-2 border-muted-foreground/40" />
            <CardTitle className="text-lg">Gold</CardTitle>
            <Text className="text-muted-foreground text-sm leading-5">
              Full access to every feature, plus priority support.
            </Text>
          </CardHeader>
          <CardFooter className="flex-row items-center justify-between border-t-0 pt-0">
            <Text className="text-muted-foreground text-sm">{`$0.40/day ($12 billed monthly)`}</Text>
            <Button variant="ghost" size="sm" className="flex-row gap-1">
              <Text className="text-sm">More</Text>
              <Icon as={ChevronDown} className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      </View>

      <View className="gap-2">
        <Text className="text-muted-foreground text-xs font-medium uppercase">Highlight</Text>
        <Card variant="highlight">
          <CardHeader className="relative gap-2">
            <View className="absolute right-4 top-4 size-5 items-center justify-center rounded-full bg-brand">
              <Icon as={Check} className="size-3 text-brand-foreground" strokeWidth={3} />
            </View>
            <CardTitle className="text-lg">Gold</CardTitle>
            <Text className="text-muted-foreground text-sm leading-5">
              Full access to every feature, plus priority support.
            </Text>
          </CardHeader>
          <CardFooter className="flex-row items-center justify-between border-t-0 pt-0">
            <Text className="text-muted-foreground text-sm">{`$0.40/day ($12 billed monthly)`}</Text>
            <Button variant="ghost" size="sm" className="flex-row gap-1">
              <Text className="text-sm">More</Text>
              <Icon as={ChevronDown} className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      </View>
    </View>
  );
}

const meta = {
  title: 'Patterns/CardVariants',
  component: CardVariantsDemo,
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CardVariantsDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => <CardVariantsDemo />,
};
