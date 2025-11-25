import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  textColor?: string;
  backgroundColor?: string;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    { className, textColor, backgroundColor, style, children, ...props },
    ref
  ) => {
    const inlineStyles: React.CSSProperties = {
      ...style,
      ...(textColor && { color: textColor }),
      ...(backgroundColor && { backgroundColor: backgroundColor }),
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          className
        )}
        style={inlineStyles}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Tag.displayName = 'Tag';

export { Tag };
