import { Pressable } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Icon } from '~/components/ui/icon';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

type OptionCardProps = {
  label: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onPress: () => void;
};

export function OptionCard({ label, description, icon, selected, onPress }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row gap-3 rounded-xl border-2 px-4 py-4 active:opacity-90',
        selected ? 'border-brand bg-brand/5' : 'border-border bg-card'
      )}>
      {icon ? (
        <Icon
          as={icon}
          size={20}
          className={cn('mt-0.5', selected ? 'text-brand' : 'text-muted-foreground')}
        />
      ) : null}
      <Text className="min-w-0 flex-1">
        <Text variant="labelLarge" className="text-foreground">
          {label}
        </Text>
        {description ? (
          <Text variant="paragraphSmall" className="mt-1 text-muted-foreground">
            {'\n'}
            {description}
          </Text>
        ) : null}
      </Text>
    </Pressable>
  );
}
