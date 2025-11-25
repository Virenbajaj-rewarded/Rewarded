import { Paths } from '@/navigation/paths';
import { RootScreenProps } from '@/navigation/types';
import { useCreateProgram } from './useCreateProgram';
import ProgramForm from '../../components/ProgramForm/ProgramForm';

export default function CreateProgram({ navigation }: RootScreenProps<Paths.CREATE_PROGRAM>) {
  const { formik, handleGoBack, createProgramLoading, handlePayProgram, activateProgram } =
    useCreateProgram({
      navigation,
    });

  return (
    <ProgramForm
      formik={formik}
      handleGoBack={handleGoBack}
      loading={createProgramLoading}
      handlePayProgram={handlePayProgram}
      activateProgram={activateProgram}
    />
  );
}
