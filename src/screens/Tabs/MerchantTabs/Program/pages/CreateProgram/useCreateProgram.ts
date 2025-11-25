import { useFormik } from 'formik';
import { ICreateProgramPayload } from '@/services/program/program.types';
import { EOfferType, EProgramStrategy } from '@/enums';
import { programFormValidationSchema } from '../../validation/ProgramForm.validation.';
import { useProgram } from '@/services/program/useProgram';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { IProgram } from '@/interfaces';
import { EPaymentMethod } from '@/enums';
import { showToast } from '@/utils';

export const useCreateProgram = ({
  navigation,
}: Pick<RootScreenProps<Paths.CREATE_PROGRAM>, 'navigation'>) => {
  const { createProgram, createProgramLoading, topUpProgram, activateProgram } = useProgram();

  const handleGoBack = () => {
    navigation.goBack();
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
        await topUpProgram(program.id);
        return program;
      }
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to create program',
      });
      console.error(error);
    }
  };

  return {
    formik,
    handleGoBack,
    createProgramLoading,
    handlePayProgram,
    activateProgram,
  };
};
