import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  ItemValueStack,
  ItemValueText,
} from '~/components/ui/item';
import { Icon } from '~/components/ui/icon';
import { ChevronRight, Mail } from 'lucide-react-native';

const meta = {
  title: 'Components/Item',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
  component: Item,
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'xs', 'compact'],
      description: 'shadcn: default | sm | xs; compact → sm',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'muted', 'inset', 'highlight'],
      description: 'Surface: default (plain), outline, secondary, muted, inset, highlight',
    },
    selected: { control: 'boolean', description: 'Selection ring + semibold title' },
    pressable: { control: 'boolean', description: 'Row uses onPress (press feedback)' },
    title: { control: 'text' },
    description: { control: 'text', description: 'Secondary line; leave empty to hide' },
    trailingText: { control: 'text', description: 'Right-side value (empty = chevron only)' },
    trailingVariant: {
      control: 'select',
      options: ['muted', 'value', 'caption'],
      description: 'ItemValueText style',
    },
  },
  args: {
    storybookControls: false,
    size: 'default',
    variant: 'default',
    selected: false,
    pressable: true,
    title: 'Notifications',
    description: 'Push and email alerts',
    trailingText: '',
    trailingVariant: 'muted',
  },
} satisfies Meta<typeof Item>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithDescription: Story = {
  render: (_args) => (
    <Item onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Notifications</ItemTitle>
            <ItemDescription>Push and email alerts</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const TitleOnly: Story = {
  render: (_args) => (
    <Item onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Notifications</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const SmallSize: Story = {
  render: (_args) => (
    <Item size="sm" onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={16} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Notifications</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Icon as={ChevronRight} size={16} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const Outline: Story = {
  render: (_args) => (
    <Item variant="outline" onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Outline row</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const Muted: Story = {
  render: (_args) => (
    <Item variant="muted" onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Muted surface</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const Inset: Story = {
  render: (_args) => (
    <Item variant="inset" onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Grouped inset</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const Selected: Story = {
  render: (_args) => (
    <Item selected onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Selected</ItemTitle>
            <ItemDescription>Ring + semibold title</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const TrailingValue: Story = {
  render: (_args) => (
    <Item onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Wi‑Fi</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ItemValueText valueVariant="value">Office 5G</ItemValueText>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const TrailingCaptionAndValue: Story = {
  render: (_args) => (
    <Item onPress={() => {}}>
          <ItemMedia>
            <Icon as={Mail} size={20} className="text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Network</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ItemValueStack>
              <ItemValueText valueVariant="caption">Status</ItemValueText>
              <ItemValueText valueVariant="value">Connected</ItemValueText>
            </ItemValueStack>
            <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
          </ItemActions>
        </Item>
  ),
};

export const GroupWithSeparator: Story = {
  render: (_args) => (
    <ItemGroup className="overflow-hidden rounded-xl border border-border bg-card">
          <Item onPress={() => {}}>
            <ItemMedia>
              <Icon as={Mail} size={20} className="text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>First</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item onPress={() => {}}>
            <ItemMedia>
              <Icon as={Mail} size={20} className="text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Second</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
            </ItemActions>
          </Item>
        </ItemGroup>
  ),
};

export const Playground: Story = {
  args: {
    size: 'default',
    variant: 'default',
    selected: false,
    pressable: true,
    title: 'Notifications',
    description: 'Push and email alerts',
    trailingText: '',
    trailingVariant: 'muted',
  },
  render: (args) => {
    const {
      storybookControls,
      size,
      variant,
      selected,
      pressable,
      title,
      description,
      trailingText,
      trailingVariant,
    } = args;
    const hasDesc = String(description ?? '').trim().length > 0;
    const hasTrailing = String(trailingText ?? '').trim().length > 0;
    const s = size === 'compact' ? 'sm' : size;
    const iconSize = s === 'default' ? 20 : s === 'xs' ? 14 : 16;
    const tv = trailingVariant === 'value' || trailingVariant === 'caption' || trailingVariant === 'muted' ? trailingVariant : 'muted';
    return (
      <Item
        size={s}
        variant={variant}
        selected={selected}
        onPress={pressable ? () => {} : undefined}
      >
        <ItemMedia>
          <Icon as={Mail} size={iconSize} className="text-muted-foreground" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{String(title)}</ItemTitle>
          {hasDesc ? <ItemDescription>{String(description)}</ItemDescription> : null}
        </ItemContent>
        <ItemActions>
          {hasTrailing ? (
            <ItemValueText valueVariant={tv}>{String(trailingText)}</ItemValueText>
          ) : null}
          <Icon as={ChevronRight} size={iconSize} className="shrink-0 text-muted-foreground" />
        </ItemActions>
      </Item>
    );
  },
};
