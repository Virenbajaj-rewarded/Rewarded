import { useFormik } from 'formik';
import { IEditProgramPayload } from '@/services/program/program.types';
import { programFormValidationSchema } from '../../validation/ProgramForm.validation.';
import { useProgram } from '@/services/program/useProgram';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { EPaymentMethod } from '@/enums';
import { showToast } from '@/utils';
import { IProgram } from '@/interfaces';

export const useEditProgram = ({ navigation, route }: RootScreenProps<Paths.EDIT_PROGRAM>) => {
  const { editProgram, editProgramLoading, topUpProgram, activateProgram } = useProgram();
  const program = route.params.program;

  const {
    percentBack,
    spendThreshold,
    rewardPercent,
    name,
    strategy,
    offerType,
    maxDailyBudget,
    budget,
    id,
  } = program;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEditProgram = async (values: IEditProgramPayload): Promise<IProgram | undefined> => {
    if (!program) return;
    const {
      percentBack,
      spendThreshold,
      rewardPercent,
      name,
      strategy,
      offerType,
      maxDailyBudget,
      budget,
      id,
    } = values;

    const payload: IEditProgramPayload = {
      id,
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
      await editProgram(payload);
      return {
        ...program,
        ...payload,
      } as IProgram;
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik<IEditProgramPayload>({
    initialValues: {
      id,
      name,
      strategy,
      offerType,
      percentBack,
      spendThreshold,
      rewardPercent,
      maxDailyBudget,
      budget,
    },
    validationSchema: programFormValidationSchema,
    onSubmit: async values => {
      await handleEditProgram(values);
      handleGoBack();
    },
    enableReinitialize: true,
  });

  const handlePayProgram = async (
    _selectedPaymentMethod: EPaymentMethod
  ): Promise<IProgram | undefined> => {
    try {
      const updatedProgram = await handleEditProgram(formik.values);
      if (updatedProgram && updatedProgram.id) {
        await topUpProgram(updatedProgram.id);
        return updatedProgram;
      }
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to edit program',
      });
      console.error(error);
    }
  };

  return {
    formik,
    handlePayProgram,
    handleGoBack,
    editProgramLoading,
    initialBudget: program?.budget,
    activateProgram,
  };
};
