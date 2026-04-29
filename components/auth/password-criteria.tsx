import { Check } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

export type PasswordChecks = {
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  lengthOk: boolean;
};

const RULES: { key: keyof PasswordChecks; label: string }[] = [
  { key: 'hasUpper', label: '1 uppercase' },
  { key: 'hasLower', label: '1 lowercase' },
  { key: 'hasNumber', label: '1 number' },
  { key: 'lengthOk', label: '8 to 64 characters' },
  { key: 'hasSpecial', label: '1 special character' },
];

export function evaluatePassword(password: string): PasswordChecks {
  return {
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    lengthOk: password.length >= 8 && password.length <= 64,
  };
}

export function isPasswordValid(checks: PasswordChecks): boolean {
  return Object.values(checks).every(Boolean);
}

export function PasswordCriteria({
  checks,
  monochrome,
}: {
  checks: PasswordChecks;
  monochrome?: boolean;
}) {
  return (
    <View className="gap-1.5">
      {RULES.map(({ key, label }) => {
        const ok = checks[key];
        return (
          <View key={key} className="flex-row items-center gap-2">
            <View
              className={cn(
                'size-4 items-center justify-center rounded-full border',
                ok
                  ? monochrome
                    ? 'border-foreground bg-muted'
                    : 'border-brand bg-brand/10'
                  : 'border-border bg-muted/50'
              )}>
              {ok ? (
                <Icon as={Check} size={10} className={monochrome ? 'text-foreground' : 'text-brand'} />
              ) : (
                <View className="size-1 rounded-full bg-muted-foreground/40" />
              )}
            </View>
            <Text
              variant="paragraphSmall"
              className={cn(ok ? 'text-foreground' : 'text-muted-foreground')}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
