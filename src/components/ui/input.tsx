import * as React from 'react';
import { Label } from '@/components/ui/label';

interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  error?: string;
  label?: string;
  leftMask?: string;
  rightMask?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

import { buildInputClasses } from './input-helpers';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      label,
      leftMask,
      rightMask,
      value,
      onChange,
      required,
      ...props
    },
    ref
  ) => {
    const inputValue = value !== undefined ? String(value) : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    const hasValue = inputValue !== undefined && inputValue !== '';
    const showMask = leftMask && hasValue;

    return (
      <div className="flex flex-col w-full gap-2">
        {label && (
          <Label htmlFor={props.id}>
            {required && <span className="text-[#F5222D] mr-1">*</span>}
            {label}{' '}
          </Label>
        )}
        <div className="relative">
          {showMask && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
              {leftMask}
            </span>
          )}
          <input
            type={type}
            className={buildInputClasses(
              error,
              className,
              showMask ? 'pl-14' : undefined
            )}
            ref={ref}
            value={inputValue}
            onChange={handleChange}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {rightMask && rightMask}
          </div>
        </div>
        {error && <p className="text-[14px] text-[#F5222D]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
