import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '~/components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react-native';

const meta = {
  title: 'Components/ToggleGroup',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: ToggleGroup,
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['default', 'outline'] },
  },
  args: {
    storybookControls: false,
    type: 'multiple',
    variant: 'outline',
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <View>
          <ToggleGroup type="multiple" className="flex-row">
            <ToggleGroupItem value="bold" aria-label="Bold" isFirst>
              <ToggleGroupIcon as={Bold} />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <ToggleGroupIcon as={Italic} />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline" isLast>
              <ToggleGroupIcon as={Underline} />
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
  ),
};

export const Outline: Story = {
  render: (_args) => (
    <View>
          <ToggleGroup type="multiple" variant="outline" className="flex-row">
            <ToggleGroupItem value="bold" aria-label="Bold" isFirst>
              <ToggleGroupIcon as={Bold} />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <ToggleGroupIcon as={Italic} />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline" isLast>
              <ToggleGroupIcon as={Underline} />
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
  ),
};

export const Playground: Story = {
  args: {
    type: 'multiple',
    variant: 'outline',
  },
  render: (args) => {
    const { storybookControls, type, variant, ...rest } = args;
    return (
      <View>
        <ToggleGroup type={type} variant={variant} className="flex-row" {...rest}>
          <ToggleGroupItem value="bold" aria-label="Bold" isFirst>
            <ToggleGroupIcon as={Bold} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ToggleGroupIcon as={Italic} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline" isLast>
            <ToggleGroupIcon as={Underline} />
          </ToggleGroupItem>
        </ToggleGroup>
      </View>
    );
  },
};
