import * as React from 'react';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-[8px] border-none border-input bg-[#1F1F1F] px-3 py-2 text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            error && 'border-[#FF4D4F] focus-visible:ring-[#FF4D4F]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[14px] text-[#F5222D]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
