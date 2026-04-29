import { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Text } from '~/components/ui/text';

import { Header } from './Header';

const link = (url: string, label: string) => (
  <Text
    accessibilityRole="link"
    variant="paragraphMedium"
    className="text-primary underline"
    onPress={() => {
      void Linking.openURL(url);
    }}>
    {label}
  </Text>
);

export const Page = () => {
  const [user, setUser] = useState<{ name: string } | undefined>();

  return (
    <ScrollView className="max-w-2xl flex-1 self-center" keyboardShouldPersistTaps="handled">
      <View className="pb-10">
        <Header
          user={user}
          onLogin={() => setUser({ name: 'Jane Doe' })}
          onLogout={() => setUser(undefined)}
          onCreateAccount={() => setUser({ name: 'Jane Doe' })}
        />

        <View className="gap-8 px-5 pt-8">
          <View className="gap-2">
            <Text variant="headingMedium" className="text-foreground">
              Phoenix design workspace
            </Text>
            <Text variant="paragraphMedium" className="text-muted-foreground">
              This Storybook uses the same semantic typography as the app: Base Web–style{' '}
              <Text variant="paragraphMedium" className="font-medium text-foreground">
                Display
              </Text>
              ,{' '}
              <Text variant="paragraphMedium" className="font-medium text-foreground">
                Heading
              </Text>
              ,{' '}
              <Text variant="paragraphMedium" className="font-medium text-foreground">
                Label
              </Text>
              , and{' '}
              <Text variant="paragraphMedium" className="font-medium text-foreground">
                Paragraph
              </Text>{' '}
              tokens from{' '}
              <Text variant="paragraphMedium" className="font-mono text-sm text-muted-foreground">
                ~/components/ui/text
              </Text>
              . Prefer <Text className="font-medium text-foreground">variant=</Text> over ad hoc font
              sizes so screens stay aligned with the type scale.
            </Text>
          </View>

          <View className="gap-3">
            <Text variant="headingXSmall" className="text-foreground">
              Component-driven UI
            </Text>
            <Text variant="paragraphMedium" className="text-muted-foreground">
              Build from atoms upward: primitives in{' '}
              <Text variant="paragraphMedium" className="text-foreground">
                components/ui
              </Text>
              , composed into flows and pages. Storybook lets you review states with mock data without
              wiring navigation.
            </Text>
            <View className="gap-3 pl-1">
              <View className="flex-row gap-2">
                <Text variant="labelMedium" className="text-muted-foreground">
                  ·
                </Text>
                <Text variant="paragraphMedium" className="flex-1 text-muted-foreground">
                  Reuse stories via composition and args instead of duplicating layout in the app.
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text variant="labelMedium" className="text-muted-foreground">
                  ·
                </Text>
                <Text variant="paragraphMedium" className="flex-1 text-muted-foreground">
                  Mock services at the page boundary so screens stay testable in isolation.
                </Text>
              </View>
            </View>
          </View>

          <Separator />

          <View className="gap-3">
            <Text variant="headingXSmall" className="text-foreground">
              Tokens in this file
            </Text>
            <Text variant="paragraphSmall" className="text-muted-foreground">
              Headings use <Text className="font-mono text-xs">headingMedium</Text>,{' '}
              <Text className="font-mono text-xs">headingXSmall</Text>; body copy uses{' '}
              <Text className="font-mono text-xs">paragraphMedium</Text> /{' '}
              <Text className="font-mono text-xs">paragraphSmall</Text>; secondary tone uses{' '}
              <Text className="font-mono text-xs">text-muted-foreground</Text> on{' '}
              <Text className="font-mono text-xs">Text</Text>.
            </Text>
            <View className="flex-row flex-wrap gap-x-3 gap-y-1">
              <Text variant="labelSmall" className="text-muted-foreground">
                labelSmall
              </Text>
              <Text variant="labelMedium" className="text-foreground">
                labelMedium
              </Text>
              <Text variant="paragraphSmall" className="text-muted-foreground">
                paragraphSmall
              </Text>
            </View>
          </View>

          <Card variant="outline">
            <CardHeader className="gap-1">
              <CardTitle variant="headingXSmall">Quick links</CardTitle>
              <CardDescription>
                External references for Storybook and component-driven workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Pressable
                accessibilityRole="link"
                className="active:opacity-80"
                onPress={() => {
                  void Linking.openURL('https://componentdriven.org');
                }}>
                <Text variant="paragraphMedium" className="text-primary">
                  Component-driven development →
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                className="active:opacity-80"
                onPress={() => {
                  void Linking.openURL('https://storybook.js.org/tutorials/');
                }}>
                <Text variant="paragraphMedium" className="text-primary">
                  Storybook tutorials →
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                className="active:opacity-80"
                onPress={() => {
                  void Linking.openURL('https://storybook.js.org/docs');
                }}>
                <Text variant="paragraphMedium" className="text-primary">
                  Storybook docs →
                </Text>
              </Pressable>
            </CardContent>
          </Card>

          <View className="gap-2">
            <Text variant="labelSmall" className="uppercase tracking-wide text-muted-foreground">
              Inline resources
            </Text>
            <Text variant="paragraphMedium" className="text-muted-foreground">
              Read more at {link('https://storybook.js.org/tutorials/', 'Storybook tutorials')} and the{' '}
              {link('https://storybook.js.org/docs', 'documentation')}. Explore{' '}
              {link('https://ui.shadcn.com/docs/components/radix/item', 'shadcn Item')} for patterns
              similar to our <Text className="font-mono text-xs text-foreground">Item</Text> primitive.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
