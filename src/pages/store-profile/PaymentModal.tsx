import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IStore } from '@/interfaces';
import { FormikProvider, FormikProps } from 'formik';
import WalletIcon from '@/assets/wallet.svg?react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: IStore | null;
  formik: FormikProps<{ points: string }>;
  isLoading: boolean;
  balance: number;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  store,
  formik,
  isLoading,
  balance,
}: PaymentModalProps) => {
  const handleClose = async () => {
    await formik.resetForm();
    onOpenChange(false);
  };

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter top up amount</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0C1A31] text-[#639CF8] rounded-md text-sm font-medium">
              <WalletIcon className="h-4 w-4" />
              CAD {balance?.toFixed(2)} balance
            </div>

            <div className="w-full [&>div]:gap-0 [&_input[type='number']]:appearance-none [&_input[type='number']::-webkit-inner-spin-button]:appearance-none [&_input[type='number']::-webkit-outer-spin-button]:appearance-none [&_input[type='number']]:[-moz-appearance:textfield] [&_input:focus-visible]:!ring-0 [&_input:focus-visible]:!ring-transparent">
              <Input
                value={formik.values.points}
                onChange={formik.handleChange('points')}
                onBlur={() => formik.handleBlur('points')}
                error={
                  formik.touched.points && formik.errors.points
                    ? formik.errors.points
                    : undefined
                }
                placeholder="0"
                className="!h-auto !text-center !text-6xl !font-semibold !bg-transparent !text-white !outline-none !border-none !shadow-none !ring-0 !focus-visible:ring-0 !focus-visible:ring-transparent !focus-visible:ring-offset-0 !focus-visible:border-none !focus-visible:outline-none !focus:ring-0 !focus:border-none !focus:outline-none !px-0 !py-0 placeholder:!text-[#BFBFBF]/50"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full text-[#3C83F6]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => formik.handleSubmit()}
              disabled={isLoading || !formik.isValid || !formik.dirty}
              className="w-full bg-[#3C83F6] text-white hover:bg-[#3C83F6]/80"
            >
              {isLoading ? 'Processing...' : 'Pay'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormikProvider>
  );
};
