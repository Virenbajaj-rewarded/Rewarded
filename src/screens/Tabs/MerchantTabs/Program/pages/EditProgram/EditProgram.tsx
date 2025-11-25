import { Paths } from '@/navigation/paths';
import { RootScreenProps } from '@/navigation/types';
import { useEditProgram } from './useEditProgram';
import ProgramForm from '../../components/ProgramForm/ProgramForm';

export default function EditProgram({ navigation, route }: RootScreenProps<Paths.EDIT_PROGRAM>) {
  const {
    formik,
    handleGoBack,
    editProgramLoading,
    handlePayProgram,
    activateProgram,
    initialBudget,
  } = useEditProgram({
    navigation,
    route,
  });

  return (
    <ProgramForm
      formik={formik}
      handleGoBack={handleGoBack}
      loading={editProgramLoading}
      handlePayProgram={handlePayProgram}
      activateProgram={activateProgram}
      initialBudget={initialBudget}
    />
  );
}
