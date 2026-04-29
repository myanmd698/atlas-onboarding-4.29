import Constants from 'expo-constants';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  BookOpen,
  ChevronRight,
  Cpu,
  FileText,
  HelpCircle,
  Info,
  Shield,
  Smartphone,
} from 'lucide-react-native';
import { Platform, ScrollView, View } from 'react-native';

import { Icon } from '~/components/ui/icon';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  ItemValueText,
} from '~/components/ui/item';
import { Text } from '~/components/ui/text';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber =
  Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android:
      Constants.expoConfig?.android?.versionCode != null
        ? String(Constants.expoConfig.android.versionCode)
        : undefined,
    default: undefined,
  }) ?? 'preview';

function InformationExample() {
  return (
    <ScrollView className="max-h-[720px] w-full flex-1" keyboardShouldPersistTaps="handled">
      <View className="gap-6 px-1 pb-4 pt-1">
        <View className="gap-1">
          <Text variant="headingMedium" className="text-foreground">
            About
          </Text>
          <Text className="text-sm text-muted-foreground">
            App details and legal. ItemGroup is unpadded; separators are full width; rows use Item padding.
          </Text>
        </View>

        <View className="gap-2">
          <ItemHeader>Application</ItemHeader>
          <ItemGroup className="overflow-hidden rounded-xl border border-border bg-card">
            <Item>
              <ItemMedia>
                <Icon as={Info} size={20} className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Version</ItemTitle>
                <ItemDescription>Current release</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ItemValueText valueVariant="value">{appVersion}</ItemValueText>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item>
              <ItemMedia>
                <Icon as={Cpu} size={20} className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Build</ItemTitle>
                <ItemDescription>Native build id</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ItemValueText valueVariant="value">{String(buildNumber)}</ItemValueText>
              </ItemActions>
            </Item>
          </ItemGroup>
        </View>

        <View className="gap-2">
          <ItemHeader>Device</ItemHeader>
          <ItemGroup className="overflow-hidden rounded-xl border border-border bg-card">
            <Item>
              <ItemMedia>
                <Icon as={Smartphone} size={20} className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Platform</ItemTitle>
                <ItemDescription>Runtime OS</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ItemValueText valueVariant="value">{Platform.OS}</ItemValueText>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item onPress={() => {}}>
              <ItemMedia>
                <Icon as={BookOpen} size={20} className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Documentation</ItemTitle>
                <ItemDescription>Open project README</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </View>

        <View className="gap-2">
          <ItemHeader>Legal & support</ItemHeader>
          <ItemGroup className="overflow-hidden rounded-xl border border-border bg-card">
            <Item onPress={() => {}}>
              <ItemMedia>
                <Icon as={FileText} size={20} className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Terms of service</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item onPress={() => {}}>
              <ItemMedia>
                <Icon as={Shield} size={20} className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Privacy</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item onPress={() => {}}>
              <ItemMedia>
                <Icon as={HelpCircle} size={20} className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Help & feedback</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </View>
      </View>
    </ScrollView>
  );
}

const meta = {
  title: 'Patterns/Information',
  component: InformationExample,
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof InformationExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithItemGroups: Story = {
  render: () => <InformationExample />,
};
