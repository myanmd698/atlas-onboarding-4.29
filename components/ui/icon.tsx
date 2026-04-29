import { ButtonIconContext, type ButtonIconContextValue } from '~/components/ui/button';
import { TextClassContext } from '~/components/ui/text';
import { LUCIDE_STROKE_WIDTH } from '~/lib/lucide';
import { cn } from '~/lib/utils';
import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import * as React from 'react';

type IconProps = LucideProps & {
  as: LucideIcon;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  if (IconComponent == null) {
    return null;
  }
  return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
    },
  },
});

/**
 * A wrapper component for Lucide icons with Nativewind `className` support via `cssInterop`.
 *
 * This component allows you to render any Lucide icon while applying utility classes
 * using `nativewind`. It avoids the need to wrap or configure each icon individually.
 *
 * @component
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@/registry/components/ui/icon';
 *
 * <Icon as={ArrowRight} className="text-red-500" size={16} />
 * ```
 *
 * @param {LucideIcon} as - The Lucide icon component to render.
 * @param {string} className - Utility classes to style the icon using Nativewind.
 * @param {number} size - Icon size (defaults to 14).
 * @param {number} strokeWidth - Stroke width (defaults to {@link LUCIDE_STROKE_WIDTH}).
 * @param {...LucideProps} ...props - Additional Lucide icon props passed to the "as" icon.
 */
function defaultIconSizeForButtonSize(buttonSize: ButtonIconContextValue['buttonSize']): number {
  switch (buttonSize) {
    case 'sm':
      return 15;
    case 'lg':
      return 18;
    case 'icon':
      return 20;
    default:
      return 16;
  }
}

/** Slightly heavier than global default so icons read with semibold button labels. */
const BUTTON_ICON_STROKE = 2;

function Icon({ as: IconComponent, className, size, strokeWidth, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext);
  const btnIcon = React.useContext(ButtonIconContext);
  if (IconComponent == null) {
    return null;
  }
  const colorClass = btnIcon?.iconClassName ?? textClass;
  const inButton = btnIcon != null;

  const resolvedSize = size ?? (inButton ? defaultIconSizeForButtonSize(btnIcon.buttonSize) : 14);
  const resolvedStroke = strokeWidth ?? (inButton ? BUTTON_ICON_STROKE : LUCIDE_STROKE_WIDTH);

  return (
    <IconImpl
      as={IconComponent}
      className={cn(
        'text-foreground',
        colorClass,
        inButton && 'shrink-0 self-center',
        className
      )}
      size={resolvedSize}
      strokeWidth={resolvedStroke}
      {...props}
    />
  );
}

export { Icon };
