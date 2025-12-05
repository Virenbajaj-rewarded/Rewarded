import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IProgram } from '@/interfaces';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import WalletIcon from '@/assets/wallet.svg?react';

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: IProgram | null;
  onTopUp: (programId: string, amount: number) => Promise<void>;
  isLoading: boolean;
}

const topUpProgramValidationSchema = Yup.object().shape({
  amount: Yup.string()
    .required('Points are required')
    .matches(/^\d+(\.\d+)?$/, 'Only numbers are allowed')
    .test('min-value', 'Must be greater than 0', value => {
      if (!value) return false;
      return parseFloat(value) > 0;
    }),
});

export const TopUpModal = ({
  open,
  onOpenChange,
  program,
  onTopUp,
  isLoading,
}: TopUpModalProps) => {
  const handleTopUpProgram = async (values: { amount: string }) => {
    if (!program || !values.amount) return;
    const amount = Number(values.amount);

    await onTopUp(program.id, amount);
    formik.resetForm();
    onOpenChange(false);
  };

  const formik = useFormik({
    initialValues: {
      amount: '0',
    },
    validationSchema: topUpProgramValidationSchema,
    onSubmit: handleTopUpProgram,
  });

  const remainingBudget = program?.fundedAmount - program?.spentAmount;

  const handleClose = () => {
    formik.resetForm();
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
            {remainingBudget !== undefined && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0C1A31] text-[#639CF8] rounded-md text-sm font-medium">
                <WalletIcon className="h-4 w-4" />
                CAD {remainingBudget.toFixed(2)} Program Balance
              </div>
            )}

            <div className="w-full [&>div]:gap-0 [&_input[type='number']]:appearance-none [&_input[type='number']::-webkit-inner-spin-button]:appearance-none [&_input[type='number']::-webkit-outer-spin-button]:appearance-none [&_input[type='number']]:[-moz-appearance:textfield] [&_input:focus-visible]:!ring-0 [&_input:focus-visible]:!ring-transparent">
              <Input
                value={formik.values.amount}
                onChange={formik.handleChange('amount')}
                onBlur={formik.handleBlur('amount')}
                error={
                  formik.touched.amount && formik.errors.amount
                    ? formik.errors.amount
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
              type="submit"
              onClick={() => formik.handleSubmit()}
              disabled={isLoading || !formik.isValid || !formik.dirty}
              className="w-full bg-[#3C83F6] text-white hover:bg-[#3C83F6]/80"
            >
              {isLoading ? 'Topping Up...' : 'Top Up'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormikProvider>
  );
};
