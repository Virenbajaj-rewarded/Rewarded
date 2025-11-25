import * as React from 'react';
import EyeIcon from '@/assets/eye.svg?react';
import EyeClosedIcon from '@/assets/eye-closed.svg?react';

import { Label } from '@/components/ui/label';
import { buildInputClasses } from './input-helpers';
import { cn } from '@/lib/utils';

interface PasswordInputProps
  extends Omit<React.ComponentProps<'input'>, 'type'> {
  error?: string;
  label?: string;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      className,
      error,
      label,
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(prev => !prev);

    return (
      <div className="flex flex-col w-full gap-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <div className="relative">
          <input
            type={isVisible ? 'text' : 'password'}
            className={buildInputClasses(error, cn('pr-12', className))}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground"
            aria-label={isVisible ? hidePasswordLabel : showPasswordLabel}
          >
            {isVisible ? <EyeIcon /> : <EyeClosedIcon />}
          </button>
        </div>
        {error && <p className="text-[14px] text-[#F5222D]">{error}</p>}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
