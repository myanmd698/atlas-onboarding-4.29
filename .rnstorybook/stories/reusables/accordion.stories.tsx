import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Accordion',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Accordion,
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean', description: 'Single type only: allow closing the open item' },
  },
  args: {
    storybookControls: false,
    type: 'single',
    collapsible: true,
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (_args) => (
    <Accordion type="single" collapsible defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>
              <Text>First item</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>First content</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>
              <Text>Second item</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Second content</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
  ),
};

export const Multiple: Story = {
  render: (_args) => (
    <Accordion type="multiple" defaultValue={['a']}>
          <AccordionItem value="a">
            <AccordionTrigger>
              <Text>First item</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>First content</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>
              <Text>Second item</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Second content</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
  ),
};

export const Playground: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args) => {
    const { storybookControls, type, collapsible } = args;
    const isSingle = type === 'single';
    return (
      <Accordion
        type={type}
        collapsible={isSingle ? collapsible : undefined}
        defaultValue={isSingle ? 'a' : ['a']}
      >
        <AccordionItem value="a">
          <AccordionTrigger>
            <Text>Demo item</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>Adjust type and collapsible via Controls.</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
};
