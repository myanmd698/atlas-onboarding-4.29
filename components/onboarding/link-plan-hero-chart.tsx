import * as React from 'react';
import { Image, View } from 'react-native';

export const LINK_PLAN_HERO_COPY =
  'Connect your accounts to see your finances in one place—easy to find, easy to understand.';

const chartAsset = require('../../assets/images/link-plan-chart-locked.png');

/** Reference asset: blurred dual-line preview with centered lock — replaces programmatic graph. */
export function LinkPlanHeroChart() {
  return (
    <View className="overflow-hidden rounded-xl border border-border bg-card">
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel="Locked chart preview. Link accounts to see your finances."
        source={chartAsset}
        resizeMode="cover"
        style={{ width: '100%', height: 200 }}
      />
    </View>
  );
}
