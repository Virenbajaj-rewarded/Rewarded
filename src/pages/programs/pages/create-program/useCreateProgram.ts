import { useFormik } from 'formik';
import { ICreateProgramPayload } from '@/services/program/program.types';
import { EOfferType, EProgramStrategy } from '@/enums';
import { programFormValidationSchema } from '../../validation/ProgramForm.validation';
import { useProgram } from '@/services/program/useProgram';
import { useNavigate } from 'react-router-dom';
import { IProgram } from '@/interfaces';
import { EPaymentMethod } from '@/enums';
import { toast } from 'sonner';

export const useCreateProgram = () => {
  const navigate = useNavigate();
  const { createProgram, createProgramLoading, fundProgram, activateProgram } =
    useProgram();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCreateProgram = async (
    values: ICreateProgramPayload
  ): Promise<IProgram | undefined> => {
    const {
      percentBack,
      spendThreshold,
      rewardPercent,
      name,
      strategy,
      offerType,
      maxDailyBudget,
      budget,
    } = values;
    const payload = {
      name,
      strategy,
      offerType,
      maxDailyBudget: Number(maxDailyBudget),
      budget: Number(budget),
      ...(percentBack && { percentBack: Number(percentBack) }),
      ...(spendThreshold && { spendThreshold: Number(spendThreshold) }),
      ...(rewardPercent && { rewardPercent: Number(rewardPercent) }),
    };
    try {
      return await createProgram(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik<ICreateProgramPayload>({
    initialValues: {
      name: '',
      strategy: EProgramStrategy.PERCENT_BACK,
      offerType: EOfferType.POINTS_CASHBACK,
      percentBack: null,
      spendThreshold: null,
      rewardPercent: null,
      maxDailyBudget: null,
      budget: null,
    },
    validationSchema: programFormValidationSchema,
    onSubmit: async values => {
      await handleCreateProgram(values);
      handleGoBack();
    },
    enableReinitialize: true,
  });

  const handlePayProgram = async (
    _selectedPaymentMethod: EPaymentMethod
  ): Promise<IProgram | undefined> => {
    try {
      const program = await handleCreateProgram(formik.values);
      if (program && program.id) {
        await fundProgram(program.id);
        return program;
      }
    } catch (error) {
      toast.error('Failed to create program');
      console.error(error);
    }
  };

  return {
    formik,
    createProgramLoading,
    handlePayProgram,
    activateProgram,
  };
};
