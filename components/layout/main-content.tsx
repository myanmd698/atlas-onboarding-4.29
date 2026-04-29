import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '~/lib/utils';

/** Tailwind classes: centered column, max width ~1152px, responsive horizontal padding + top inset. */
export const MAIN_CONTENT_MAX_WIDTH_CLASS =
  'w-full max-w-6xl self-center px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8';

type MainContentProps = {
  children: ReactNode;
  className?: string;
};

export function MainContent({ children, className }: MainContentProps) {
  return <View className={cn(MAIN_CONTENT_MAX_WIDTH_CLASS, className)}>{children}</View>;
}
