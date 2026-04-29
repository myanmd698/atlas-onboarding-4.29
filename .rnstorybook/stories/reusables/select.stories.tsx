import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const meta = {
  title: 'Components/Select',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Select,
  argTypes: {
    placeholder: { control: 'text' },
    selected: { control: 'select', options: ['a', 'b'], description: 'Default selected value' },
  },
  args: {
    storybookControls: false,
    placeholder: 'Pick one',
    selected: 'a',
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View className="w-full max-w-xs">
          <Select defaultValue={{ value: 'a', label: 'Apple' }}>
            <SelectTrigger>
              <SelectValue placeholder="Pick one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem label="Apple" value="a" />
              <SelectItem label="Banana" value="b" />
            </SelectContent>
          </Select>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    placeholder: 'Pick one',
    selected: 'a',
  },
  render: (args) => {
    const { storybookControls, placeholder, selected, ...rest } = args;
    const label = selected === 'a' ? 'Apple' : 'Banana';
    return (
      <View className="w-full max-w-xs">
        <Select defaultValue={{ value: selected, label }} {...rest}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem label="Apple" value="a" />
            <SelectItem label="Banana" value="b" />
          </SelectContent>
        </Select>
      </View>
    );
  },
};
