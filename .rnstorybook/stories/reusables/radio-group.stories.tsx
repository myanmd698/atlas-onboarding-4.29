import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/RadioGroup',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: RadioGroup,
  argTypes: {
    defaultValue: { control: 'select', options: ['a', 'b'] },
  },
  args: {
    storybookControls: false,
    defaultValue: 'a',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <RadioGroup defaultValue="a">
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="a" id="r1" />
              <Label htmlFor="r1">
                <Text>Option A</Text>
              </Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="b" id="r2" />
              <Label htmlFor="r2">
                <Text>Option B</Text>
              </Label>
            </View>
          </View>
        </RadioGroup>
  ),
};

export const Playground: Story = {
  args: {
    defaultValue: 'a',
  },
  render: (args) => {
    const { storybookControls, defaultValue, ...rest } = args;
    return (
      <RadioGroup defaultValue={defaultValue} {...rest}>
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <RadioGroupItem value="a" id="r-pg-a" />
            <Label htmlFor="r-pg-a">
              <Text>Option A</Text>
            </Label>
          </View>
          <View className="flex-row items-center gap-2">
            <RadioGroupItem value="b" id="r-pg-b" />
            <Label htmlFor="r-pg-b">
              <Text>Option B</Text>
            </Label>
          </View>
        </View>
      </RadioGroup>
    );
  },
};
