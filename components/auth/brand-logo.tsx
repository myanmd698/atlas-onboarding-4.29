import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export function BrandLogo({ size = 44 }: { size?: number }) {
  return (
    <View
      className="items-center justify-center rounded-2xl bg-brand"
      style={{ width: size, height: size }}>
      <Text variant="headingMedium" className="font-serif text-brand-foreground">
        A
      </Text>
    </View>
  );
}
