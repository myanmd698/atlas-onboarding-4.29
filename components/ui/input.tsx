import { textVariants } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import { Platform, TextInput } from 'react-native';

function Input({ className, ...props }: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      className={cn(
        textVariants({ variant: 'paragraphMedium' }),
        'dark:bg-input/30 border-input bg-background flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 shadow-sm shadow-black/5 sm:h-9',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-[14px] md:leading-[20px]',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        className
      )}
      {...props}
    />
  );
}

export { Input };
