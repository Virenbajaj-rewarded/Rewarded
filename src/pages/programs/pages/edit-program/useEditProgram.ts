import { useFormik } from 'formik';
import { IEditProgramPayload } from '@/services/program/program.types';
import { programFormValidationSchema } from '../../validation/ProgramForm.validation';
import { useProgram } from '@/services/program/useProgram';
import { useNavigate, useLocation } from 'react-router-dom';
import { IProgram } from '@/interfaces';
import { EPaymentMethod } from '@/enums';
import { toast } from 'sonner';

export const useEditProgram = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editProgram, editProgramLoading, fundProgram, activateProgram } =
    useProgram();

  const program = (location.state as { program?: IProgram })?.program;
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
    navigate(-1);
  };

  const handleEditProgram = async (
    values: IEditProgramPayload
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
        await fundProgram(updatedProgram.id);
        return updatedProgram;
      }
    } catch (error) {
      toast.error('Failed to edit program');
      console.error(error);
    }
  };

  return {
    formik,
    editProgramLoading,
    handlePayProgram,
    activateProgram,
    initialBudget: budget,
  };
};
