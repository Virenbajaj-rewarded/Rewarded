import { useFormik } from 'formik';
import { topUpProgramValidationSchema } from './TopUpProgram.validation';
import { useProgram } from '@/services/program/useProgram';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';

export const useTopUpProgram = ({ navigation, route }: RootScreenProps<Paths.TOP_UP_PROGRAM>) => {
  const program = route.params.program;
  const { topUpProgram, topUpProgramLoading, topUpProgramSuccess } = useProgram();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTopUpProgram = async (values: { amount: string }) => {
    const amount = Number(values.amount);
    await topUpProgram({ id: program.id, amount });
  };

  const formik = useFormik({
    initialValues: {
      amount: '0',
    },
    validationSchema: topUpProgramValidationSchema,
    onSubmit: handleTopUpProgram,
  });

  return {
    formik,
    topUpProgramLoading,
    topUpProgramSuccess,
    handleGoBack,
  };
};
