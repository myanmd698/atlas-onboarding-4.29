#!/usr/bin/env node
/**
 * Generates one CSF story per file in components/ui/ so Storybook lists every component under Components/.
 * Each file includes a **Playground** story + `meta.argTypes` + `meta.args` so devs can inspect props (on-device Controls).
 * `meta.args` mirrors Playground defaults so numeric Controls never start as `undefined` (avoids RN-web controlled-input warnings in @storybook/addon-ondevice-controls).
 * Run: node scripts/gen-storybook-reusables.mjs && npm run storybook-generate
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const uiDir = path.join(root, 'components', 'ui');
const outDir = path.join(root, '.rnstorybook', 'stories', 'reusables');

/** @type {Record<string, { title: string; imports: string; body: string }>} */
const TEMPLATES = {
  'aspect-ratio': {
    title: 'Components/AspectRatio',
    imports: `import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    body: `<View className="w-72 p-2">
      <AspectRatio ratio={16 / 9}>
        <View className="bg-muted w-full items-center justify-center rounded-md">
          <Text className="text-muted-foreground text-sm">16:9</Text>
        </View>
      </AspectRatio>
    </View>`,
    metaComponentType: 'AspectRatio',
    metaExtras: `  component: AspectRatio,
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.25, max: 3, step: 0.05 },
      description: 'Width ÷ height (e.g. 1.778 ≈ 16:9)',
    },
  },
  args: {
    storybookControls: false,
    ratio: 16 / 9,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => {
    const { storybookControls, ratio, ..._r } = args;
    const r = Number(ratio ?? 16 / 9);
    return (
      <View className="w-72 p-2">
        <AspectRatio ratio={r}>
          <View className="bg-muted w-full items-center justify-center rounded-md">
            <Text className="text-muted-foreground text-sm">{r.toFixed(3)}</Text>
          </View>
        </AspectRatio>
      </View>
    );
  },
};`,
  },
  avatar: {
    title: 'Components/Avatar',
    imports: `import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Text } from '~/components/ui/text';`,
    body: `<Avatar className="size-14" alt="User">
      <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
      <AvatarFallback>
        <Text>CN</Text>
      </AvatarFallback>
    </Avatar>`,
    metaComponentType: 'Avatar',
    metaExtras: `  component: Avatar,
  argTypes: {
    alt: { control: 'text', description: 'Accessibility label' },
    fallbackLabel: { control: 'text', description: 'Initials when image off' },
    showImage: { control: 'boolean', description: 'Load remote avatar image' },
  },
  args: {
    storybookControls: false,
    alt: 'User',
    fallbackLabel: 'CN',
    showImage: true,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    alt: 'User',
    fallbackLabel: 'CN',
    showImage: true,
  },
  render: (args) => {
    const { storybookControls, showImage, fallbackLabel, alt, ...rest } = args;
    return (
      <Avatar className="size-14" alt={String(alt)} {...rest}>
        {showImage ? <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} /> : null}
        <AvatarFallback>
          <Text>{String(fallbackLabel)}</Text>
        </AvatarFallback>
      </Avatar>
    );
  },
};`,
  },
  badge: {
    title: 'Components/Badge',
    imports: `import { Badge } from '~/components/ui/badge';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<View>
      <Badge variant="default">
        <Text>Default</Text>
      </Badge>
    </View>`,
      },
      {
        name: 'Secondary',
        body: `<View>
      <Badge variant="secondary">
        <Text>Secondary</Text>
      </Badge>
    </View>`,
      },
      {
        name: 'Destructive',
        body: `<View>
      <Badge variant="destructive">
        <Text>Destructive</Text>
      </Badge>
    </View>`,
      },
      {
        name: 'Brand',
        body: `<View>
      <Badge variant="brand">
        <Text>New</Text>
      </Badge>
    </View>`,
      },
      {
        name: 'Outline',
        body: `<View>
      <Badge variant="outline">
        <Text>Outline</Text>
      </Badge>
    </View>`,
      },
    ],
    metaComponentType: 'Badge',
    metaExtras: `  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'brand', 'outline'],
    },
    label: { control: 'text', description: 'Badge label' },
  },
  args: {
    storybookControls: false,
    variant: 'default',
    label: 'Badge',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    variant: 'default',
    label: 'Badge',
  },
  render: (args) => {
    const { storybookControls, label, ...badgeArgs } = args;
    return (
      <View>
        <Badge {...badgeArgs}>
          <Text>{String(label)}</Text>
        </Badge>
      </View>
    );
  },
};`,
  },
  button: {
    title: 'Components/Button',
    imports: `import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';
import { Loader2, Mail } from 'lucide-react-native';`,
    stories: [
      {
        name: 'Primary',
        body: `<View>
      <Button>
        <Text>Primary</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Secondary',
        body: `<View>
      <Button variant="secondary">
        <Text>Secondary</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Brand',
        body: `<View>
      <Button variant="brand">
        <Text>Brand</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Destructive',
        body: `<View>
      <Button variant="destructive">
        <Text>Destructive</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Outline',
        body: `<View>
      <Button variant="outline">
        <Text>Outline</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Ghost',
        body: `<View>
      <Button variant="ghost">
        <Text>Ghost</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Link',
        body: `<View>
      <Button variant="link">
        <Text>Link</Text>
      </Button>
    </View>`,
      },
      {
        name: 'IconOnly',
        body: `<View>
      <Button size="icon" variant="outline" accessibilityLabel="Email">
        <Icon as={Mail} />
      </Button>
    </View>`,
      },
      {
        name: 'WithIcon',
        body: `<View>
      <Button>
        <Icon as={Mail} />
        <Text>Login with Email</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Loading',
        body: `<View>
      <Button disabled>
        <Icon as={Loader2} className="animate-spin text-primary-foreground" />
        <Text>Please wait</Text>
      </Button>
    </View>`,
      },
      {
        name: 'Sizes',
        body: `<View className="flex-row flex-wrap items-center gap-2">
      <Button size="sm">
        <Text>Small</Text>
      </Button>
      <Button size="default">
        <Text>Default</Text>
      </Button>
      <Button size="lg">
        <Text>Large</Text>
      </Button>
    </View>`,
      },
    ],
    /** Enables @storybook/addon-ondevice-controls (needs args + component on meta). */
    metaComponentType: 'Button',
    metaExtras: `  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    variant: 'default',
    size: 'default',
    disabled: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, ...buttonArgs } = args;
    return (
      <View>
        <Button {...buttonArgs}>
          <Text>Button</Text>
        </Button>
      </View>
    );
  },
};`,
  },
  card: {
    title: 'Components/Card',
    imports: `import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';`,
    body: `<Card variant="outline" className="self-stretch w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Card</CardTitle>
        <CardDescription>Description text.</CardDescription>
      </CardHeader>
      <CardContent>
        <Text variant="paragraphSmall" className="text-muted-foreground">Content area.</Text>
      </CardContent>
      <CardFooter className="flex-row gap-2">
        <Button variant="outline">
          <Text>Cancel</Text>
        </Button>
        <Button>
          <Text>OK</Text>
        </Button>
      </CardFooter>
    </Card>`,
    metaComponentType: 'Card',
    metaExtras: `  component: Card,
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
  },`,
    playgroundStory: `export const Playground: Story = {
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
          <Text variant="paragraphSmall" className="text-muted-foreground">{String(bodyText)}</Text>
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
};`,
  },
  accordion: {
    title: 'Components/Accordion',
    imports: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Text } from '~/components/ui/text';`,
    stories: [
      {
        name: 'Single',
        body: `<Accordion type="single" collapsible defaultValue="a">
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
    </Accordion>`,
      },
      {
        name: 'Multiple',
        body: `<Accordion type="multiple" defaultValue={['a']}>
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
    </Accordion>`,
      },
    ],
    metaComponentType: 'Accordion',
    metaExtras: `  component: Accordion,
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean', description: 'Single type only: allow closing the open item' },
  },
  args: {
    storybookControls: false,
    type: 'single',
    collapsible: true,
  },`,
    playgroundStory: `export const Playground: Story = {
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
};`,
  },
  alert: {
    title: 'Components/Alert',
    imports: `import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle } from 'lucide-react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<Alert icon={AlertCircle}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Short supporting copy for the alert.</AlertDescription>
    </Alert>`,
      },
      {
        name: 'Destructive',
        body: `<Alert icon={AlertCircle} variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>`,
      },
    ],
    metaComponentType: 'Alert',
    metaExtras: `  component: Alert,
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive'] },
  },
  args: {
    storybookControls: false,
    variant: 'default',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => {
    const { storybookControls, ...alertArgs } = args;
    return (
      <Alert icon={AlertCircle} {...alertArgs}>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Short supporting copy for the alert.</AlertDescription>
      </Alert>
    );
  },
};`,
  },
  'alert-dialog': {
    title: 'Components/AlertDialog',
    imports: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';`,
    body: `<AlertDialog defaultOpen={false}>
      <AlertDialogTrigger asChild>
        <Button>
          <Text>Open</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction>
            <Text>Continue</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>`,
    metaComponentType: 'AlertDialog',
    metaExtras: `  component: AlertDialog,
  argTypes: {
    defaultOpen: { control: 'boolean' },
    titleText: { control: 'text' },
    descriptionText: { control: 'text' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
    titleText: 'Are you sure?',
    descriptionText: 'This action cannot be undone.',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultOpen: false,
    titleText: 'Are you sure?',
    descriptionText: 'This action cannot be undone.',
  },
  render: (args) => {
    const { storybookControls, titleText, descriptionText, defaultOpen, ...rest } = args;
    return (
      <AlertDialog defaultOpen={defaultOpen} {...rest}>
        <AlertDialogTrigger asChild>
          <Button>
            <Text>Open</Text>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{String(titleText)}</AlertDialogTitle>
            <AlertDialogDescription>{String(descriptionText)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};`,
  },
  checkbox: {
    title: 'Components/Checkbox',
    imports: `import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<View className="flex-row items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">
        <Text>Accept terms</Text>
      </Label>
    </View>`,
      },
      {
        name: 'Checked',
        body: `<View className="flex-row items-center gap-2">
      <Checkbox id="terms2" defaultChecked />
      <Label htmlFor="terms2">
        <Text>Checked by default</Text>
      </Label>
    </View>`,
      },
      {
        name: 'Disabled',
        body: `<View className="flex-row items-center gap-2">
      <Checkbox id="terms3" disabled />
      <Label htmlFor="terms3" className="opacity-50">
        <Text>Disabled</Text>
      </Label>
    </View>`,
      },
    ],
    metaComponentType: 'Checkbox',
    metaExtras: `  component: Checkbox,
  argTypes: {
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultChecked: false,
    disabled: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultChecked: false,
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, ...boxArgs } = args;
    return (
      <View className="flex-row items-center gap-2">
        <Checkbox id="terms-pg" {...boxArgs} />
        <Label htmlFor="terms-pg">
          <Text>Accept terms</Text>
        </Label>
      </View>
    );
  },
};`,
  },
  collapsible: {
    title: 'Components/Collapsible',
    imports: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    body: `<Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text className="font-medium">Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <View className="pt-2">
          <Text className="text-muted-foreground text-sm">Hidden content</Text>
        </View>
      </CollapsibleContent>
    </Collapsible>`,
    metaComponentType: 'Collapsible',
    metaExtras: `  component: Collapsible,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <Collapsible defaultOpen={defaultOpen} {...rest}>
        <CollapsibleTrigger>
          <Text className="font-medium">Toggle</Text>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <View className="pt-2">
            <Text className="text-muted-foreground text-sm">Hidden content</Text>
          </View>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};`,
  },
  'context-menu': {
    title: 'Components/ContextMenu',
    imports: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    body: `<ContextMenu defaultOpen={false}>
      <ContextMenuTrigger>
        <View className="bg-muted rounded-md px-4 py-8">
          <Text className="text-center text-muted-foreground">Right-click (web) or long-press</Text>
        </View>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Text>Action</Text>
        </ContextMenuItem>
        <ContextMenuItem>
          <Text>Another</Text>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>`,
    metaComponentType: 'ContextMenu',
    metaExtras: `  component: ContextMenu,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <ContextMenu defaultOpen={defaultOpen} {...rest}>
        <ContextMenuTrigger>
          <View className="bg-muted rounded-md px-4 py-8">
            <Text className="text-center text-muted-foreground">Right-click (web) or long-press</Text>
          </View>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Text>Action</Text>
          </ContextMenuItem>
          <ContextMenuItem>
            <Text>Another</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};`,
  },
  dialog: {
    title: 'Components/Dialog',
    imports: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';`,
    body: `<Dialog defaultOpen={false}>
      <DialogTrigger asChild>
        <Button>
          <Text>Open dialog</Text>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description goes here.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>`,
    metaComponentType: 'Dialog',
    metaExtras: `  component: Dialog,
  argTypes: {
    defaultOpen: { control: 'boolean' },
    titleText: { control: 'text' },
    descriptionText: { control: 'text' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
    titleText: 'Dialog title',
    descriptionText: 'Dialog description goes here.',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultOpen: false,
    titleText: 'Dialog title',
    descriptionText: 'Dialog description goes here.',
  },
  render: (args) => {
    const { storybookControls, titleText, descriptionText, defaultOpen, ...rest } = args;
    return (
      <Dialog defaultOpen={defaultOpen} {...rest}>
        <DialogTrigger asChild>
          <Button>
            <Text>Open dialog</Text>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{String(titleText)}</DialogTitle>
            <DialogDescription>{String(descriptionText)}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  },
};`,
  },
  'dropdown-menu': {
    title: 'Components/DropdownMenu',
    imports: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';`,
    body: `<DropdownMenu defaultOpen={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Text>Open menu</Text>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Text>Profile</Text>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Text>Settings</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>`,
    metaComponentType: 'DropdownMenu',
    metaExtras: `  component: DropdownMenu,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <DropdownMenu defaultOpen={defaultOpen} {...rest}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Text>Open menu</Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Text>Profile</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Settings</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};`,
  },
  'hover-card': {
    title: 'Components/HoverCard',
    imports: `import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    body: `<HoverCard>
      <HoverCardTrigger>
        <View className="self-start">
          <Text className="text-primary underline">@hover</Text>
        </View>
      </HoverCardTrigger>
      <HoverCardContent>
        <Text className="text-sm">Hover card body</Text>
      </HoverCardContent>
    </HoverCard>`,
    metaComponentType: 'HoverCard',
    metaExtras: `  component: HoverCard,
  argTypes: {
    contentAlign: {
      control: 'select',
      options: ['center', 'start', 'end'],
      description: 'HoverCardContent align',
    },
  },
  args: {
    storybookControls: false,
    contentAlign: 'center',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    contentAlign: 'center',
  },
  render: (args) => {
    const { storybookControls, contentAlign, ...rest } = args;
    return (
      <HoverCard {...rest}>
        <HoverCardTrigger>
          <View className="self-start">
            <Text className="text-primary underline">@hover</Text>
          </View>
        </HoverCardTrigger>
        <HoverCardContent align={contentAlign}>
          <Text className="text-sm">Hover card body</Text>
        </HoverCardContent>
      </HoverCard>
    );
  },
};`,
  },
  input: {
    title: 'Components/Input',
    imports: `import { Input } from '~/components/ui/input';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<View className="w-full max-w-xs">
      <Input placeholder="Email" />
    </View>`,
      },
      {
        name: 'Disabled',
        body: `<View className="w-full max-w-xs">
      <Input placeholder="Email" editable={false} value="disabled@example.com" />
    </View>`,
      },
    ],
    metaComponentType: 'Input',
    metaExtras: `  component: Input,
  argTypes: {
    placeholder: { control: 'text' },
    editable: { control: 'boolean', description: 'When false, field is read-only / disabled styling' },
  },
  args: {
    storybookControls: false,
    placeholder: 'Email',
    editable: true,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    placeholder: 'Email',
    editable: true,
  },
  render: (args) => {
    const { storybookControls, ...inputArgs } = args;
    return (
      <View className="w-full max-w-xs">
        <Input {...inputArgs} />
      </View>
    );
  },
};`,
  },
  label: {
    title: 'Components/Label',
    imports: `import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    body: `<View className="w-full max-w-xs gap-2">
      <Label nativeID="email">
        <Text>Email</Text>
      </Label>
      <Input nativeID="email" placeholder="you@example.com" />
    </View>`,
    metaComponentType: 'Label',
    metaExtras: `  component: Label,
  argTypes: {
    labelText: { control: 'text', description: 'Visible label' },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    labelText: 'Email',
    disabled: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    labelText: 'Email',
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, labelText, ...labelArgs } = args;
    return (
      <View className="w-full max-w-xs gap-2">
        <Label nativeID="email-label" {...labelArgs}>
          <Text>{String(labelText)}</Text>
        </Label>
        <Input nativeID="email-label" placeholder="you@example.com" />
      </View>
    );
  },
};`,
  },
  menubar: {
    title: 'Components/Menubar',
    imports: `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '~/components/ui/menubar';
import { Text } from '~/components/ui/text';`,
    body: `<Menubar>
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
    </Menubar>`,
    metaComponentType: 'Menubar',
    metaExtras: `  component: Menubar,
  argTypes: {
    className: { control: 'text', description: 'Root className (Tailwind)' },
    value: { control: 'text', description: 'Which menu is open (controlled)' },
  },
  args: {
    storybookControls: false,
    className: '',
    value: '',
  },`,
    playgroundStory: `export const Playground: Story = {
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
};`,
  },
  popover: {
    title: 'Components/Popover',
    imports: `import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Text } from '~/components/ui/text';`,
    body: `<Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Text>Open popover</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Text className="text-sm">Popover content</Text>
      </PopoverContent>
    </Popover>`,
    metaComponentType: 'Popover',
    metaExtras: `  component: Popover,
  argTypes: {
    defaultOpen: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultOpen: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => {
    const { storybookControls, defaultOpen, ...rest } = args;
    return (
      <Popover defaultOpen={defaultOpen} {...rest}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Text>Open popover</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Text className="text-sm">Popover content</Text>
        </PopoverContent>
      </Popover>
    );
  },
};`,
  },
  progress: {
    title: 'Components/Progress',
    imports: `import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Value33',
        body: `<View className="w-full max-w-xs gap-1 py-2">
      <Progress value={33} />
      <Text className="text-muted-foreground text-xs">33%</Text>
    </View>`,
      },
      {
        name: 'Value66',
        body: `<View className="w-full max-w-xs gap-1 py-2">
      <Progress value={66} />
      <Text className="text-muted-foreground text-xs">66%</Text>
    </View>`,
      },
      {
        name: 'Value100',
        body: `<View className="w-full max-w-xs gap-1 py-2">
      <Progress value={100} />
      <Text className="text-muted-foreground text-xs">100%</Text>
    </View>`,
      },
    ],
    metaComponentType: 'Progress',
    metaExtras: `  component: Progress,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  args: {
    storybookControls: false,
    value: 50,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    value: 50,
  },
  render: (args) => {
    const { storybookControls, ...rest } = args;
    return (
      <View className="w-full max-w-xs gap-1 py-2">
        <Progress {...rest} />
        <Text className="text-muted-foreground text-xs">Drag value (0–100)</Text>
      </View>
    );
  },
};`,
  },
  'radio-group': {
    title: 'Components/RadioGroup',
    imports: `import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    body: `<RadioGroup defaultValue="a">
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
    </RadioGroup>`,
    metaComponentType: 'RadioGroup',
    metaExtras: `  component: RadioGroup,
  argTypes: {
    defaultValue: { control: 'select', options: ['a', 'b'] },
  },
  args: {
    storybookControls: false,
    defaultValue: 'a',
  },`,
    playgroundStory: `export const Playground: Story = {
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
};`,
  },
  select: {
    title: 'Components/Select',
    imports: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    body: `<View className="w-full max-w-xs">
      <Select defaultValue={{ value: 'a', label: 'Apple' }}>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem label="Apple" value="a" />
          <SelectItem label="Banana" value="b" />
        </SelectContent>
      </Select>
    </View>`,
    metaComponentType: 'Select',
    metaExtras: `  component: Select,
  argTypes: {
    placeholder: { control: 'text' },
    selected: { control: 'select', options: ['a', 'b'], description: 'Default selected value' },
  },
  args: {
    storybookControls: false,
    placeholder: 'Pick one',
    selected: 'a',
  },`,
    playgroundStory: `export const Playground: Story = {
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
};`,
  },
  separator: {
    title: 'Components/Separator',
    imports: `import { Separator } from '~/components/ui/separator';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Horizontal',
        body: `<View className="gap-2">
      <Text>Above</Text>
      <Separator orientation="horizontal" />
      <Text>Below</Text>
    </View>`,
      },
      {
        name: 'Vertical',
        body: `<View className="h-24 flex-row items-stretch gap-3">
      <Text>Left</Text>
      <Separator orientation="vertical" />
      <Text>Right</Text>
    </View>`,
      },
    ],
    metaComponentType: 'Separator',
    metaExtras: `  component: Separator,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  args: {
    storybookControls: false,
    orientation: 'horizontal',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => {
    const { storybookControls, ...sepArgs } = args;
    return (
      <View className="gap-2">
        <Text>Above</Text>
        <Separator {...sepArgs} />
        <Text>Below</Text>
      </View>
    );
  },
};`,
  },
  skeleton: {
    title: 'Components/Skeleton',
    imports: `import { Skeleton } from '~/components/ui/skeleton';
import { View } from 'react-native';`,
    body: `<View className="gap-2">
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
    </View>`,
    metaComponentType: 'Skeleton',
    metaExtras: `  component: Skeleton,
  argTypes: {
    barClass: { control: 'text', description: 'First row className' },
    lineClass: { control: 'text', description: 'Second row className' },
  },
  args: {
    storybookControls: false,
    barClass: 'h-12 w-full rounded-md',
    lineClass: 'h-4 w-2/3 rounded-md',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    barClass: 'h-12 w-full rounded-md',
    lineClass: 'h-4 w-2/3 rounded-md',
  },
  render: (args) => {
    const { storybookControls, barClass, lineClass } = args;
    return (
      <View className="gap-2">
        <Skeleton className={String(barClass)} />
        <Skeleton className={String(lineClass)} />
      </View>
    );
  },
};`,
  },
  switch: {
    title: 'Components/Switch',
    imports: `import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<View className="flex-row items-center gap-2">
      <Switch id="sw1" />
      <Label htmlFor="sw1">
        <Text>Off</Text>
      </Label>
    </View>`,
      },
      {
        name: 'Checked',
        body: `<View className="flex-row items-center gap-2">
      <Switch id="sw2" defaultChecked />
      <Label htmlFor="sw2">
        <Text>On</Text>
      </Label>
    </View>`,
      },
      {
        name: 'Disabled',
        body: `<View className="flex-row items-center gap-2">
      <Switch id="sw3" disabled />
      <Label htmlFor="sw3" className="opacity-50">
        <Text>Disabled</Text>
      </Label>
    </View>`,
      },
    ],
    metaComponentType: 'Switch',
    metaExtras: `  component: Switch,
  argTypes: {
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    defaultChecked: false,
    disabled: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultChecked: false,
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, ...swArgs } = args;
    return (
      <View className="flex-row items-center gap-2">
        <Switch id="sw-pg" {...swArgs} />
        <Label htmlFor="sw-pg">
          <Text>Airplane mode</Text>
        </Label>
      </View>
    );
  },
};`,
  },
  tabs: {
    title: 'Components/Tabs',
    imports: `import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';`,
    body: `<Tabs defaultValue="one" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="one">
          <Text>One</Text>
        </TabsTrigger>
        <TabsTrigger value="two">
          <Text>Two</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="one">
        <Text className="text-muted-foreground text-sm">Tab one</Text>
      </TabsContent>
      <TabsContent value="two">
        <Text className="text-muted-foreground text-sm">Tab two</Text>
      </TabsContent>
    </Tabs>`,
    metaComponentType: 'Tabs',
    metaExtras: `  component: Tabs,
  argTypes: {
    defaultValue: { control: 'select', options: ['one', 'two'] },
  },
  args: {
    storybookControls: false,
    defaultValue: 'one',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    defaultValue: 'one',
  },
  render: (args) => {
    const { storybookControls, defaultValue, ...rest } = args;
    return (
      <Tabs defaultValue={defaultValue} className="w-full max-w-sm" {...rest}>
        <TabsList>
          <TabsTrigger value="one">
            <Text>One</Text>
          </TabsTrigger>
          <TabsTrigger value="two">
            <Text>Two</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one">
          <Text className="text-muted-foreground text-sm">Tab one</Text>
        </TabsContent>
        <TabsContent value="two">
          <Text className="text-muted-foreground text-sm">Tab two</Text>
        </TabsContent>
      </Tabs>
    );
  },
};`,
  },
  textarea: {
    title: 'Components/Textarea',
    imports: `import { Textarea } from '~/components/ui/textarea';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<View className="w-full max-w-xs">
      <Textarea placeholder="Notes" numberOfLines={4} />
    </View>`,
      },
      {
        name: 'Disabled',
        body: `<View className="w-full max-w-xs">
      <Textarea placeholder="Notes" numberOfLines={4} editable={false} value="Read-only content." />
    </View>`,
      },
    ],
    metaComponentType: 'Textarea',
    metaExtras: `  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    editable: { control: 'boolean', description: 'When false, read-only / disabled styling' },
  },
  args: {
    storybookControls: false,
    placeholder: 'Notes',
    editable: true,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    placeholder: 'Notes',
    editable: true,
  },
  render: (args) => {
    const { storybookControls, ...taArgs } = args;
    return (
      <View className="w-full max-w-xs">
        <Textarea numberOfLines={4} {...taArgs} />
      </View>
    );
  },
};`,
  },
  text: {
    title: 'Components/Text',
    imports: `import { Text } from '~/components/ui/text';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Typography',
        body: `<View className="max-w-xl gap-4">
      <Text variant="displayLarge">Display Large</Text>
      <Text variant="displayMedium">Display Medium</Text>
      <Text variant="displaySmall">Display Small</Text>
      <Text variant="displayXSmall">Display XSmall</Text>
      <Text variant="headingXXLarge">Heading XXLarge</Text>
      <Text variant="headingXLarge">Heading XLarge</Text>
      <Text variant="headingLarge">Heading Large</Text>
      <Text variant="headingMedium">Heading Medium</Text>
      <Text variant="headingSmall">Heading Small</Text>
      <Text variant="headingXSmall">Heading XSmall</Text>
      <Text variant="labelLarge">Label Large</Text>
      <Text variant="labelMedium">Label Medium</Text>
      <Text variant="labelSmall">Label Small</Text>
      <Text variant="labelXSmall">Label XSmall</Text>
      <Text variant="paragraphLarge">Paragraph Large</Text>
      <Text variant="paragraphMedium">Paragraph Medium (default)</Text>
      <Text variant="paragraphSmall">Paragraph Small</Text>
      <Text variant="paragraphXSmall">Paragraph XSmall</Text>
      <Text variant="paragraphSmall" className="text-muted-foreground">Secondary line — color via className</Text>
      <Text variant="paragraphMedium" className="font-mono">Paragraph Medium + font-mono</Text>
      <Text>Implicit paragraphMedium</Text>
    </View>`,
      },
    ],
    metaComponentType: 'Text',
    metaExtras: `  component: Text,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'displayLarge',
        'displayMedium',
        'displaySmall',
        'displayXSmall',
        'headingXXLarge',
        'headingXLarge',
        'headingLarge',
        'headingMedium',
        'headingSmall',
        'headingXSmall',
        'labelLarge',
        'labelMedium',
        'labelSmall',
        'labelXSmall',
        'paragraphLarge',
        'paragraphMedium',
        'paragraphSmall',
        'paragraphXSmall',
      ],
    },
    label: { control: 'text', description: 'Text content' },
  },
  args: {
    storybookControls: false,
    variant: 'paragraphMedium',
    label: 'The quick brown fox jumps over the lazy dog.',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    variant: 'paragraphMedium',
    label: 'The quick brown fox jumps over the lazy dog.',
  },
  render: (args) => {
    const { storybookControls, label, ...textArgs } = args;
    return (
      <View className="max-w-xl">
        <Text {...textArgs}>{String(label)}</Text>
      </View>
    );
  },
};`,
  },
  toggle: {
    title: 'Components/Toggle',
    imports: `import { Toggle, ToggleIcon } from '~/components/ui/toggle';
import { Bold } from 'lucide-react-native';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<View>
      <Toggle aria-label="Toggle bold">
        <ToggleIcon as={Bold} />
      </Toggle>
    </View>`,
      },
      {
        name: 'Outline',
        body: `<View>
      <Toggle variant="outline" aria-label="Toggle bold">
        <ToggleIcon as={Bold} />
      </Toggle>
    </View>`,
      },
      {
        name: 'Small',
        body: `<View>
      <Toggle size="sm" aria-label="Toggle bold">
        <ToggleIcon as={Bold} />
      </Toggle>
    </View>`,
      },
      {
        name: 'Large',
        body: `<View>
      <Toggle size="lg" aria-label="Toggle bold">
        <ToggleIcon as={Bold} />
      </Toggle>
    </View>`,
      },
    ],
    metaComponentType: 'Toggle',
    metaExtras: `  component: Toggle,
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    storybookControls: false,
    variant: 'default',
    size: 'default',
    disabled: false,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  render: (args) => {
    const { storybookControls, ...tArgs } = args;
    return (
      <View>
        <Toggle aria-label="Toggle bold" {...tArgs}>
          <ToggleIcon as={Bold} />
        </Toggle>
      </View>
    );
  },
};`,
  },
  'toggle-group': {
    title: 'Components/ToggleGroup',
    imports: `import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '~/components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react-native';
import { View } from 'react-native';`,
    stories: [
      {
        name: 'Default',
        body: `<View>
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
    </View>`,
      },
      {
        name: 'Outline',
        body: `<View>
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
    </View>`,
      },
    ],
    metaComponentType: 'ToggleGroup',
    metaExtras: `  component: ToggleGroup,
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['default', 'outline'] },
  },
  args: {
    storybookControls: false,
    type: 'multiple',
    variant: 'outline',
  },`,
    playgroundStory: `export const Playground: Story = {
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
};`,
  },
  tooltip: {
    title: 'Components/Tooltip',
    imports: `import { Text } from '~/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { View } from 'react-native';`,
    body: `<Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <View className="self-start rounded-md border border-border px-3 py-2">
          <Text>Hover me</Text>
        </View>
      </TooltipTrigger>
      <TooltipContent>
        <Text>Tooltip</Text>
      </TooltipContent>
    </Tooltip>`,
    metaComponentType: 'Tooltip',
    metaExtras: `  component: Tooltip,
  argTypes: {
    delayDuration: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
  },
  args: {
    storybookControls: false,
    delayDuration: 200,
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    delayDuration: 200,
  },
  render: (args) => {
    const { storybookControls, delayDuration, ...rest } = args;
    return (
      <Tooltip delayDuration={delayDuration} {...rest}>
        <TooltipTrigger asChild>
          <View className="self-start rounded-md border border-border px-3 py-2">
            <Text>Hover me</Text>
          </View>
        </TooltipTrigger>
        <TooltipContent>
          <Text>Tooltip</Text>
        </TooltipContent>
      </Tooltip>
    );
  },
};`,
  },
  icon: {
    title: 'Components/Icon',
    imports: `import { Icon } from '~/components/ui/icon';
import { Heart } from 'lucide-react-native';`,
    body: `<Icon as={Heart} className="text-primary size-8" />`,
    metaComponentType: 'Icon',
    metaExtras: `  component: Icon,
  argTypes: {
    className: { control: 'text', description: 'NativeWind classes (e.g. text-primary size-8)' },
  },
  args: {
    storybookControls: false,
    className: 'text-primary size-8',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    className: 'text-primary size-8',
  },
  render: (args) => {
    const { storybookControls, className } = args;
    return <Icon as={Heart} className={String(className)} />;
  },
};`,
  },
  item: {
    title: 'Components/Item',
    imports: `import {
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
import { ChevronRight, Mail } from 'lucide-react-native';`,
    stories: [
      {
        name: 'WithDescription',
        body: `<Item onPress={() => {}}>
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
    </Item>`,
      },
      {
        name: 'TitleOnly',
        body: `<Item onPress={() => {}}>
      <ItemMedia>
        <Icon as={Mail} size={20} className="text-muted-foreground" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Notifications</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
      </ItemActions>
    </Item>`,
      },
      {
        name: 'SmallSize',
        body: `<Item size="sm" onPress={() => {}}>
      <ItemMedia>
        <Icon as={Mail} size={16} className="text-muted-foreground" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Notifications</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Icon as={ChevronRight} size={16} className="shrink-0 text-muted-foreground" />
      </ItemActions>
    </Item>`,
      },
      {
        name: 'Outline',
        body: `<Item variant="outline" onPress={() => {}}>
      <ItemMedia>
        <Icon as={Mail} size={20} className="text-muted-foreground" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Outline row</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
      </ItemActions>
    </Item>`,
      },
      {
        name: 'Muted',
        body: `<Item variant="muted" onPress={() => {}}>
      <ItemMedia>
        <Icon as={Mail} size={20} className="text-muted-foreground" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Muted surface</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
      </ItemActions>
    </Item>`,
      },
      {
        name: 'Inset',
        body: `<Item variant="inset" onPress={() => {}}>
      <ItemMedia>
        <Icon as={Mail} size={20} className="text-muted-foreground" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Grouped inset</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Icon as={ChevronRight} size={20} className="shrink-0 text-muted-foreground" />
      </ItemActions>
    </Item>`,
      },
      {
        name: 'Selected',
        body: `<Item selected onPress={() => {}}>
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
    </Item>`,
      },
      {
        name: 'TrailingValue',
        body: `<Item onPress={() => {}}>
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
    </Item>`,
      },
      {
        name: 'TrailingCaptionAndValue',
        body: `<Item onPress={() => {}}>
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
    </Item>`,
      },
      {
        name: 'GroupWithSeparator',
        body: `<ItemGroup className="overflow-hidden rounded-xl border border-border bg-card">
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
    </ItemGroup>`,
      },
    ],
    metaComponentType: 'Item',
    metaExtras: `  component: Item,
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
  },`,
    playgroundStory: `export const Playground: Story = {
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
};`,
  },
  'native-only-animated-view': {
    title: 'Components/NativeOnlyAnimatedView',
    imports: `import { NativeOnlyAnimatedView } from '~/components/ui/native-only-animated-view';
import { Text } from '~/components/ui/text';`,
    body: `<NativeOnlyAnimatedView className="rounded-md bg-muted p-4">
      <Text className="text-muted-foreground text-xs">Internal primitive (animations)</Text>
    </NativeOnlyAnimatedView>`,
    metaComponentType: 'NativeOnlyAnimatedView',
    metaExtras: `  component: NativeOnlyAnimatedView,
  argTypes: {
    className: { control: 'text', description: 'Wrapper classes' },
    caption: { control: 'text', description: 'Inner text' },
  },
  args: {
    storybookControls: false,
    className: 'rounded-md bg-muted p-4',
    caption: 'Internal primitive (animations)',
  },`,
    playgroundStory: `export const Playground: Story = {
  args: {
    className: 'rounded-md bg-muted p-4',
    caption: 'Internal primitive (animations)',
  },
  render: (args) => {
    const { storybookControls, className, caption } = args;
    return (
      <NativeOnlyAnimatedView className={String(className)}>
        <Text className="text-muted-foreground text-xs">{String(caption)}</Text>
      </NativeOnlyAnimatedView>
    );
  },
};`,
  },
};

function stripDuplicateViewImport(imports) {
  return imports
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      return (
        t !== "import { View } from 'react-native';" && t !== 'import { View } from "react-native";'
      );
    })
    .join('\n');
}

/**
 * @param {{ stories?: { name: string; body: string }[]; body?: string }} tpl
 */
function normalizeStories(tpl) {
  if (tpl.stories?.length) return tpl.stories;
  if (tpl.body != null) return [{ name: 'Default', body: tpl.body }];
  throw new Error('Template must define stories[] or body');
}

function indentForRender(body) {
  return body
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : `    ${line}`))
    .join('\n');
}

function buildFile(title, imports, tpl) {
  const stories = normalizeStories(tpl);
  const storyExports = stories
    .map((s) => {
      const id = s.name.replace(/[^a-zA-Z0-9_]/g, '');
      return `export const ${id}: Story = {
  render: (_args) => (
${indentForRender(s.body)}
  ),
};`;
    })
    .join('\n\n');

  const metaSuffix = tpl.metaExtras ? `\n${tpl.metaExtras}` : '';
  const satisfiesMeta = tpl.metaComponentType
    ? `satisfies Meta<typeof ${tpl.metaComponentType}>`
    : 'satisfies Meta';

  const playgroundBlock = tpl.playgroundStory
    ? `${storyExports ? '\n\n' : ''}${tpl.playgroundStory}`
    : '';

  return `import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

${stripDuplicateViewImport(imports)}

const meta = {
  title: '${title}',
  decorators: [
    (Story) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],${metaSuffix}
} ${satisfiesMeta};

export default meta;

type Story = StoryObj<typeof meta>;

${storyExports}${playgroundBlock}
`;
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(uiDir).filter((f) => f.endsWith('.tsx'));
const missing = [];

for (const file of files) {
  const base = file.replace(/\.tsx$/, '');
  const tpl = TEMPLATES[base];
  if (!tpl) {
    missing.push(base);
    continue;
  }
  const outPath = path.join(outDir, `${base}.stories.tsx`);
  fs.writeFileSync(outPath, buildFile(tpl.title, tpl.imports, tpl), 'utf8');
}

if (missing.length) {
  console.error('Missing templates for:', missing.join(', '));
  process.exit(1);
}

console.log('Wrote', files.length, 'Components story files to', outDir);
