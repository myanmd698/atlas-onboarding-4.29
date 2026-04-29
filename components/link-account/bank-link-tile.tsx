import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { getBankLogoSource } from '~/lib/bank-logos';
import { type MockAccount } from '~/lib/mockAccounts';

const LOGO_PX = 40;

export function accountPickerLabel(b: MockAccount): string {
  return b.name || b.institutionName;
}

type BankLinkTileProps = {
  bank: MockAccount;
  isLinked: boolean;
  onPress: () => void;
};

export function BankLinkTile({ bank, isLinked, onPress }: BankLinkTileProps) {
  const logo = getBankLogoSource(bank.institutionName);

  return (
    <Pressable
      onPress={onPress}
      style={styles.cardPressable}
      className={`relative w-[47%] overflow-hidden rounded-xl border-2 p-4 sm:w-[31%] ${
        isLinked ? 'border-brand bg-brand/5' : 'border-border bg-card'
      }`}>
      {isLinked ? (
        <View className="bg-brand absolute right-2 top-2 z-10 size-6 items-center justify-center rounded-full">
          <Icon as={Check} size={14} className="text-brand-foreground" />
        </View>
      ) : null}
      <View className="mb-3 items-center justify-center" style={styles.logoRow}>
        {logo ? (
          <View style={styles.logoBox}>
            <Image source={logo} resizeMode="contain" style={styles.logoImage} />
          </View>
        ) : (
          <View className="size-10 rounded-md bg-muted" />
        )}
      </View>
      <Text variant="labelSmall" className="text-center text-foreground" numberOfLines={2}>
        {accountPickerLabel(bank)}
      </Text>
      {isLinked ? (
        <Text variant="paragraphXSmall" className="mt-2 text-center text-muted-foreground">
          Linked
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardPressable: {
    maxWidth: '100%',
  },
  logoRow: {
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: LOGO_PX,
    height: LOGO_PX,
    overflow: 'hidden',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: LOGO_PX,
    height: LOGO_PX,
    maxWidth: LOGO_PX,
    maxHeight: LOGO_PX,
  },
});
