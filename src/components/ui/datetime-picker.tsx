import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type Props = {
  label?: string;
  placeholder?: string;
  value?: string | null;
  onChange: (iso: string | null) => void;
  disabled?: boolean;
  className?: string;
};

export function DateTimePicker({
  label,
  placeholder = 'Select date & time',
  value,
  onChange,
  disabled,
  className,
}: Props) {
  const parsed = value ? new Date(value) : undefined;
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(parsed);
  const [timeStr, setTimeStr] = React.useState<string>(
    parsed ? format(parsed, 'HH:mm') : '00:00'
  );

  React.useEffect(() => {
    if (!open) {
      // sync from outside when popover closes
      const d = value ? new Date(value) : undefined;
      setDate(d);
      setTimeStr(d ? format(d, 'HH:mm') : '00:00');
    }
  }, [open, value]);

  const commit = (d?: Date, t?: string) => {
    const base = d ?? date;
    const hhmm = (t ?? (timeStr || '00:00')).split(':');
    if (!base || hhmm.length !== 2) {
      onChange(null);
      return;
    }
    const hours = Number(hhmm[0]);
    const minutes = Number(hhmm[1]);
    const copy = new Date(
      Date.UTC(
        base.getUTCFullYear(),
        base.getUTCMonth(),
        base.getUTCDate(),
        Number.isFinite(hours) ? hours : 0,
        Number.isFinite(minutes) ? minutes : 0,
        0,
        0
      )
    );
    onChange(copy.toISOString());
  };

  const display = value
    ? format(new Date(value), "yyyy-MM-dd HH:mm 'UTC'")
    : '';

  return (
    <div className={cn('space-y-2', className)}>
      {label ? <div className="text-sm font-medium">{label}</div> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {display || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-auto" align="start">
          <div className="flex flex-col gap-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={d => {
                setDate(d);
              }}
              initialFocus
            />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={timeStr}
                onChange={e => setTimeStr(e.target.value)}
                className="w-36"
              />
              <Button size="sm" onClick={() => commit()}>
                Apply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setDate(undefined);
                  setTimeStr('00:00');
                  onChange(null);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
