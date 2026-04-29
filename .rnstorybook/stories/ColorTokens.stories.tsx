import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type SwatchRow =
  | { name: string; kind: 'solid'; swatch: string; spec: string; resolves?: string }
  | { name: string; kind: 'foregroundText'; textClass: string; spec: string; resolves?: string }
  | { name: string; kind: 'pair'; swatch: string; textClass: string; spec: string; resolves?: string }
  | { name: string; kind: 'border'; spec: string; resolves?: string }
  | { name: string; kind: 'input'; spec: string; resolves?: string }
  | { name: string; kind: 'ring'; spec: string; resolves?: string }
  | { name: string; kind: 'chart'; swatch: string; spec: string; resolves?: string }
  | { name: string; kind: 'radius'; spec: string };

type Tier = 'primitive' | 'semantic' | 'dimension';

type Group = {
  title: string;
  tier: Tier;
  rows: SwatchRow[];
};

// ─── Primitive tokens ─────────────────────────────────────────────────────────
// Raw values; no semantic meaning. Used only to define semantic aliases.

const PRIMITIVE_GROUPS: Group[] = [
  {
    title: 'Brand scale (OKLCH, hue 126.665)',
    tier: 'primitive',
    rows: [
      { name: 'brand-50', kind: 'solid', swatch: 'bg-brand-50', spec: '--brand-50' },
      { name: 'brand-100', kind: 'solid', swatch: 'bg-brand-100', spec: '--brand-100' },
      { name: 'brand-200', kind: 'solid', swatch: 'bg-brand-200', spec: '--brand-200' },
      { name: 'brand-300', kind: 'solid', swatch: 'bg-brand-300', spec: '--brand-300' },
      { name: 'brand-400', kind: 'solid', swatch: 'bg-brand-400', spec: '--brand-400' },
      { name: 'brand-500', kind: 'solid', swatch: 'bg-brand-500', spec: '--brand-500' },
      { name: 'brand-600', kind: 'solid', swatch: 'bg-brand-600', spec: '--brand-600' },
      { name: 'brand-700', kind: 'solid', swatch: 'bg-brand-700', spec: '--brand-700' },
      { name: 'brand-800', kind: 'solid', swatch: 'bg-brand-800', spec: '--brand-800' },
      { name: 'brand-900', kind: 'solid', swatch: 'bg-brand-900', spec: '--brand-900' },
      { name: 'brand-950', kind: 'solid', swatch: 'bg-brand-950', spec: '--brand-950' },
    ],
  },
];

// ─── Semantic tokens ──────────────────────────────────────────────────────────
// Role-based aliases. Theme-aware (:root / .dark). Use these in components.

const SEMANTIC_GROUPS: Group[] = [
  {
    title: 'Page',
    tier: 'semantic',
    rows: [
      {
        name: 'background',
        kind: 'solid',
        swatch: 'bg-background',
        spec: 'bg-background · --background',
        resolves: 'hsl(0 0% 100%) light\nhsl(0 0% 3.9%) dark',
      },
      {
        name: 'foreground',
        kind: 'foregroundText',
        textClass: 'text-foreground',
        spec: 'text-foreground · --foreground',
        resolves: 'hsl(0 0% 3.9%) light\nhsl(0 0% 98%) dark',
      },
    ],
  },
  {
    title: 'Intent',
    tier: 'semantic',
    rows: [
      {
        name: 'primary',
        kind: 'pair',
        swatch: 'bg-primary',
        textClass: 'text-primary-foreground',
        spec: 'bg-primary · text-primary-foreground',
        resolves: 'hsl(0 0% 9%) light\nhsl(0 0% 98%) dark',
      },
      {
        name: 'brand',
        kind: 'pair',
        swatch: 'bg-brand',
        textClass: 'text-brand-foreground',
        spec: 'bg-brand · text-brand-foreground',
        resolves: '--brand-200 light\n--brand-500 dark',
      },
      {
        name: 'secondary',
        kind: 'pair',
        swatch: 'bg-secondary',
        textClass: 'text-secondary-foreground',
        spec: 'bg-secondary · text-secondary-foreground',
        resolves: 'hsl(0 0% 96.1%) light\nhsl(0 0% 14.9%) dark',
      },
      {
        name: 'muted',
        kind: 'pair',
        swatch: 'bg-muted',
        textClass: 'text-muted-foreground',
        spec: 'bg-muted · text-muted-foreground',
        resolves: 'hsl(0 0% 96.1%) light\nhsl(0 0% 14.9%) dark',
      },
      {
        name: 'accent',
        kind: 'pair',
        swatch: 'bg-accent',
        textClass: 'text-accent-foreground',
        spec: 'bg-accent · text-accent-foreground',
        resolves: 'hsl(0 0% 96.1%) light\nhsl(0 0% 14.9%) dark',
      },
      {
        name: 'destructive',
        kind: 'pair',
        swatch: 'bg-destructive',
        textClass: 'text-destructive-foreground',
        spec: 'bg-destructive · text-destructive-foreground',
        resolves: 'hsl(0 84.2% 60.2%) light\nhsl(0 70.9% 59.4%) dark',
      },
    ],
  },
  {
    title: 'Surfaces',
    tier: 'semantic',
    rows: [
      {
        name: 'card',
        kind: 'pair',
        swatch: 'bg-card',
        textClass: 'text-card-foreground',
        spec: 'bg-card · text-card-foreground',
        resolves: 'hsl(0 0% 100%) light\nhsl(0 0% 3.9%) dark',
      },
      {
        name: 'popover',
        kind: 'pair',
        swatch: 'bg-popover',
        textClass: 'text-popover-foreground',
        spec: 'bg-popover · text-popover-foreground',
        resolves: 'hsl(0 0% 100%) light\nhsl(0 0% 3.9%) dark',
      },
    ],
  },
  {
    title: 'Chrome',
    tier: 'semantic',
    rows: [
      {
        name: 'border',
        kind: 'border',
        spec: 'border-border · --border',
        resolves: 'hsl(0 0% 89.8%) light\nhsl(0 0% 14.9%) dark',
      },
      {
        name: 'input',
        kind: 'input',
        spec: 'bg-input · --input',
        resolves: 'hsl(0 0% 89.8%) light\nhsl(0 0% 14.9%) dark',
      },
      {
        name: 'ring',
        kind: 'ring',
        spec: 'ring-ring · --ring',
        resolves: 'hsl(0 0% 63%) light\nhsl(300 0% 45%) dark',
      },
    ],
  },
  {
    title: 'Data viz',
    tier: 'semantic',
    rows: [
      { name: 'chart-1', kind: 'chart', swatch: 'bg-[hsl(var(--chart-1))]', spec: '--chart-1' },
      { name: 'chart-2', kind: 'chart', swatch: 'bg-[hsl(var(--chart-2))]', spec: '--chart-2' },
      { name: 'chart-3', kind: 'chart', swatch: 'bg-[hsl(var(--chart-3))]', spec: '--chart-3' },
      { name: 'chart-4', kind: 'chart', swatch: 'bg-[hsl(var(--chart-4))]', spec: '--chart-4' },
      { name: 'chart-5', kind: 'chart', swatch: 'bg-[hsl(var(--chart-5))]', spec: '--chart-5' },
    ],
  },
];

// ─── Dimension tokens ─────────────────────────────────────────────────────────

const DIMENSION_GROUPS: Group[] = [
  {
    title: 'Radius',
    tier: 'dimension',
    rows: [
      {
        name: 'radius',
        kind: 'radius',
        spec: 'rounded-lg → var(--radius) = 0.625rem · rounded-md = calc(radius - 2px) · rounded-sm = calc(radius - 4px)',
      },
    ],
  },
];

// ─── Swatch renderer ──────────────────────────────────────────────────────────

function Swatch({ row }: { row: SwatchRow }) {
  switch (row.kind) {
    case 'solid':
      return <View className={cn('h-12 w-full rounded-md border border-border', row.swatch)} />;
    case 'foregroundText':
      return (
        <View className="h-12 w-full items-center justify-center rounded-md border border-border bg-muted/40">
          <Text variant="labelSmall" className={row.textClass}>
            Sample text
          </Text>
        </View>
      );
    case 'pair':
      return (
        <View
          className={cn(
            'h-12 w-full items-center justify-center rounded-md border border-border',
            row.swatch
          )}>
          <Text variant="labelSmall" className={row.textClass}>
            Aa
          </Text>
        </View>
      );
    case 'border':
      return <View className="h-12 w-full rounded-md border-2 border-border bg-background" />;
    case 'input':
      return <View className="h-12 w-full rounded-md border border-border bg-input" />;
    case 'ring':
      return (
        <View className="h-12 w-full rounded-md bg-background ring-2 ring-ring ring-offset-2 ring-offset-background" />
      );
    case 'chart':
      return <View className={cn('h-12 w-full rounded-md border border-border', row.swatch)} />;
    case 'radius':
      return (
        <View className="h-12 w-full items-center justify-center rounded-none border border-dashed border-border bg-muted/30 px-6">
          <View className="h-full w-full max-w-[200px] rounded-lg bg-background shadow-sm shadow-black/10" />
        </View>
      );
    default: {
      const _exhaustive: never = row;
      return _exhaustive;
    }
  }
}

// ─── Tier badge ───────────────────────────────────────────────────────────────

const TIER_STYLES: Record<Tier, { badge: string; label: string; description: string }> = {
  primitive: {
    badge: 'bg-brand-100 text-brand-800',
    label: 'Primitive',
    description:
      'Raw values (e.g. the brand OKLCH ramp). Do not use directly in components; reference semantic aliases instead.',
  },
  semantic: {
    badge: 'bg-primary/10 text-primary',
    label: 'Semantic',
    description:
      'Role-based aliases that resolve to primitives or raw values. Theme-aware: values swap between :root and .dark. Use these in all components.',
  },
  dimension: {
    badge: 'bg-muted text-muted-foreground',
    label: 'Dimension',
    description: 'Non-color tokens for shape and spacing. Theme-invariant.',
  },
};

function TierBanner({ tier }: { tier: Tier }) {
  const s = TIER_STYLES[tier];
  return (
    <View className="rounded-lg border border-border bg-muted/30 px-4 py-3 gap-1">
      <View className="flex-row items-center gap-2">
        <View className={cn('rounded px-2 py-0.5', s.badge)}>
          <Text variant="labelSmall" className="font-semibold text-[11px]">
            {s.label}
          </Text>
        </View>
      </View>
      <Text variant="paragraphXSmall" className="text-muted-foreground leading-snug">
        {s.description}
      </Text>
    </View>
  );
}

// ─── Token table ──────────────────────────────────────────────────────────────

function TokenTable({ group, showResolves }: { group: Group; showResolves: boolean }) {
  return (
    <View className="gap-3">
      <Text variant="headingXSmall" className="text-foreground">
        {group.title}
      </Text>
      <View className="overflow-hidden rounded-lg border border-border">
        <View className="flex-row gap-3 border-b border-border bg-muted/50 px-3 py-3">
          <Text variant="labelSmall" className="w-32 shrink-0 font-semibold">
            Token
          </Text>
          <View className="min-w-0 flex-1">
            <Text variant="labelSmall" className="font-semibold">
              Preview
            </Text>
          </View>
          <Text variant="labelSmall" className="w-44 shrink-0 font-semibold">
            Tailwind / CSS var
          </Text>
          {showResolves && (
            <Text variant="labelSmall" className="w-40 shrink-0 font-semibold">
              Resolves to
            </Text>
          )}
        </View>

        {group.rows.map((row) => (
          <View
            key={row.name}
            className="flex-row items-start gap-3 border-b border-border px-3 py-4 last:border-b-0">
            <Text
              variant="paragraphXSmall"
              className="w-32 shrink-0 font-mono text-muted-foreground text-xs">
              {row.name}
            </Text>
            <View className="min-w-0 flex-1">
              <Swatch row={row} />
            </View>
            <View className="w-44 shrink-0">
              <Text
                variant="paragraphXSmall"
                className="text-[11px] font-mono leading-snug text-muted-foreground">
                {row.spec}
              </Text>
            </View>
            {showResolves && (
              <View className="w-40 shrink-0">
                {'resolves' in row && row.resolves ? (
                  <Text
                    variant="paragraphXSmall"
                    className="text-[11px] font-mono leading-snug text-muted-foreground">
                    {row.resolves}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function TierSection({ groups }: { groups: Group[] }) {
  const tier = groups[0]?.tier;
  if (!tier) return null;
  const showResolves = tier === 'semantic';
  return (
    <View className="gap-4">
      <TierBanner tier={tier} />
      {groups.map((group) => (
        <TokenTable key={group.title} group={group} showResolves={showResolves} />
      ))}
    </View>
  );
}

// ─── Page-level demos ─────────────────────────────────────────────────────────

function PrimitiveDemo() {
  return (
    <View className="w-full max-w-6xl gap-6 self-stretch">
      <View className="gap-1">
        <Text variant="headingMedium">Primitive tokens</Text>
        <Text variant="paragraphSmall" className="text-muted-foreground leading-5">
          The raw values that form the base of the token system. Currently the brand OKLCH ramp
          (brand-50–950) is the only named primitive scale. All other raw values (neutrals,
          destructive) are inlined directly in global.css without named primitives.
        </Text>
      </View>
      <TierSection groups={PRIMITIVE_GROUPS} />
    </View>
  );
}

function SemanticDemo() {
  return (
    <View className="w-full max-w-6xl gap-6 self-stretch">
      <View className="gap-1">
        <Text variant="headingMedium">Semantic tokens</Text>
        <Text variant="paragraphSmall" className="text-muted-foreground leading-5">
          {`Role-based aliases defined in global.css. Values change per theme (:root = light, .dark = dark). The 'Resolves to' column shows the raw value or primitive each token aliases. Use only semantic tokens in components; never reach for primitives directly.`}
        </Text>
      </View>
      <TierSection groups={SEMANTIC_GROUPS} />
      <TierSection groups={DIMENSION_GROUPS} />
    </View>
  );
}

function AllDemo() {
  return (
    <View className="w-full max-w-6xl gap-10 self-stretch">
      <View className="gap-1">
        <Text variant="headingMedium">All tokens</Text>
        <Text variant="paragraphSmall" className="text-muted-foreground leading-5">
          Two-tier token system: Primitive (raw values, base of scale) → Semantic (role-based
          aliases used in components). Toggle the Storybook theme to preview light/dark values.
        </Text>
      </View>

      <View className="gap-2">
        <Text variant="headingSmall" className="text-foreground">
          Tier 1: Primitive
        </Text>
        <TierSection groups={PRIMITIVE_GROUPS} />
      </View>

      <View className="gap-2">
        <Text variant="headingSmall" className="text-foreground">
          Tier 2: Semantic
        </Text>
        <TierSection groups={SEMANTIC_GROUPS} />
        <TierSection groups={DIMENSION_GROUPS} />
      </View>
    </View>
  );
}

// ─── Story config ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Foundations/Tokens',
  decorators: [
    (Story: React.ComponentType) => (
      <View className="w-full flex-1 flex-col p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<object>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primitive: Story = {
  render: () => <PrimitiveDemo />,
};

export const Semantic: Story = {
  render: () => <SemanticDemo />,
};

export const All: Story = {
  render: () => <AllDemo />,
};
