import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { QR_CODE } from '@/types';

interface QRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: QR_CODE;
  showText?: boolean;
}

export const QRModal = ({
  open,
  onOpenChange,
  value,
  showText = true,
}: QRModalProps) => {
  if (!value) return null;

  const qrCodeString = JSON.stringify(value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-none max-w-md w-[320px]">
        <DialogHeader className="pl-2">
          <DialogTitle className="text-3xl font-bold text-foreground">
            {showText ? value.value : 'My QR'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={qrCodeString} size={220} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
