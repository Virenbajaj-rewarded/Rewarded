import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import GoogleIcon from '@/assets/google.svg?react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GoogleButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children' | 'variant' | 'className'> {
  onPress: () => void | Promise<void>;
  loading?: boolean;
  text?: string;
  className?: string;
}

export default function GoogleButton({
  onPress,
  loading,
  text,
  disabled,
  className,
  ...props
}: GoogleButtonProps) {
  const handlePress = async () => {
    try {
      await onPress();
    } catch (e) {
      const error = e as Error;
      toast.error(error?.message || 'Error');
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePress}
      disabled={disabled || loading}
      variant="outline"
      className={cn(
        'w-full border-[#19222a] bg-transparent hover:bg-muted/50',
        'flex items-center justify-center gap-2 py-3 text-white',
        'hover:text-white focus-visible:ring-[#19222a]',
        className
      )}
      {...props}
    >
      <GoogleIcon className="h-5 w-5" />
      <span>{text || 'Continue with Google'}</span>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    </Button>
  );
}
