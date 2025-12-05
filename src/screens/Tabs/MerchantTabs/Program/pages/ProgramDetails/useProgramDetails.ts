import { useProgram } from '@/services/program/useProgram';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { IProgram } from '@/interfaces';

export const useProgramDetails = (programId: string) => {
  const navigation = useNavigation();
  const {
    activateProgram,
    activateProgramLoading,
    stopProgram,
    stopProgramLoading,
    renewProgram,
    renewProgramLoading,
    withdrawProgram,
    withdrawProgramLoading,
    useFetchProgramQuery,
  } = useProgram();

  const { data: program, isLoading: isLoadingProgram } = useFetchProgramQuery(programId);

  const handleActivateProgram = async (id: string) => {
    await activateProgram(id);
    navigation.goBack();
  };

  const handleStopProgram = async (id: string) => {
    await stopProgram(id);
    navigation.goBack();
  };

  const handleRenewProgram = async (id: string) => {
    await renewProgram(id);
    navigation.goBack();
  };

  const handleWithdrawProgram = async (id: string) => {
    await withdrawProgram(id);
    navigation.goBack();
  };

  const handleEditProgram = () => {
    if (program) {
      navigation.navigate(Paths.EDIT_PROGRAM, { program });
    }
  };

  const handleTopUpProgram = (program: IProgram) => {
    navigation.navigate(Paths.TOP_UP_PROGRAM, { program });
  };

  return {
    handleActivateProgram,
    activateProgramLoading,
    handleStopProgram,
    stopProgramLoading,
    handleRenewProgram,
    renewProgramLoading,
    handleWithdrawProgram,
    withdrawProgramLoading,
    handleEditProgram,
    handleTopUpProgram,
    program,
    isLoadingProgram,
  };
};
