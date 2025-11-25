import { cn } from '@/lib/utils';

export const inputBaseClasses =
  'flex h-[40px] w-full rounded-[8px] border-none border-input bg-[#1F1F1F] px-3 py-2 text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

export const inputErrorClasses =
  'border-[#FF4D4F] focus-visible:ring-[#FF4D4F]';

export const buildInputClasses = (
  error?: string,
  className?: string,
  additionalClasses?: string
) =>
  cn(
    inputBaseClasses,
    error && inputErrorClasses,
    additionalClasses,
    className
  );
