import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '~/components/ui/menubar';
import { Text } from '~/components/ui/text';

const meta = {
  title: 'Components/Menubar',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Menubar,
  argTypes: {
    className: { control: 'text', description: 'Root className (Tailwind)' },
    value: { control: 'text', description: 'Which menu is open (controlled)' },
  },
  args: {
    storybookControls: false,
    className: '',
    value: '',
  },
} satisfies Meta<typeof Menubar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args) => (
    <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>
              <Text>File</Text>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Text>New</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Open</Text>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger>
              <Text>Edit</Text>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Text>Copy</Text>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
  ),
};

export const Playground: Story = {
  args: {
    className: '',
    value: '',
  },
  render: (args) => {
    const { storybookControls, className, value, ...rest } = args;
    const openMenu = value === '' || value === undefined ? undefined : String(value);
    return (
      <Menubar className={className || undefined} value={openMenu} {...rest}>
        <MenubarMenu value="file">
          <MenubarTrigger>
            <Text>File</Text>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Text>New</Text>
            </MenubarItem>
            <MenubarItem>
              <Text>Open</Text>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="edit">
          <MenubarTrigger>
            <Text>Edit</Text>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Text>Copy</Text>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};
