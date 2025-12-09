import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EProgramStrategy } from '@/enums';

interface StopProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string | null;
  programStrategy: EProgramStrategy | null;
  onStop: (programId: string) => Promise<void>;
  isLoading: boolean;
}

export const StopProgramModal = ({
  open,
  onOpenChange,
  programId,
  programStrategy,
  onStop,
  isLoading,
}: StopProgramModalProps) => {
  const handleStopProgram = async () => {
    if (!programId) return;

    await onStop(programId);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stop This Program?</DialogTitle>
        </DialogHeader>

        <p className="text-[#BFBFBF]">
          {programStrategy === EProgramStrategy.PERCENT_BACK
            ? 'Are you sure you want to stop rewarding points? The program will move to Draft. Any remaining budget remains available until you click Withdraw.'
            : 'Are you sure you want to stop? Partial rewards will be distributed to participants based on their spend progress.'}
        </p>

        <DialogFooter className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleStopProgram}
            disabled={isLoading}
            className="w-full bg-[#FF4D4F] text-white hover:bg-[#FF4D4F]/80"
          >
            {isLoading ? 'Stopping...' : 'Stop Program'}
          </Button>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#3C83F6] hover:underline text-sm"
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
