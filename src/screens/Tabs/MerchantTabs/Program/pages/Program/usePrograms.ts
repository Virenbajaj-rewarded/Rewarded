import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus, EProgramStatusDisplayNames } from '@/enums';
import { IProgram } from '@/interfaces';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

export const usePrograms = (activeTabName: EProgramStatusDisplayNames) => {
  const navigation = useNavigation();
  const {
    stopProgram,
    stopProgramLoading,
    useFetchProgramsQuery,
    activateProgram,
    activateProgramLoading,
    renewProgram,
    renewProgramLoading,
    withdrawProgram,
    withdrawProgramLoading,
  } = useProgram();

  const {
    data,
    isLoading: isFetchProgramsLoading,
    isError: isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchProgramsQuery(
    EProgramStatus[activeTabName.toUpperCase() as keyof typeof EProgramStatus]
  );

  const programs = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  const handleStopProgram = async (id: string) => {
    await stopProgram(id);
  };

  const handleActivateProgram = async (id: string) => {
    await activateProgram(id);
  };

  const handleTopUpProgram = (program: IProgram) => {
    navigation.navigate(Paths.TOP_UP_PROGRAM, { program });
  };

  const handleRenewProgram = async (id: string) => {
    await renewProgram(id);
  };

  const handleWithdrawProgram = async (id: string) => {
    await withdrawProgram(id);
  };

  return {
    programs,
    handleStopProgram,
    stopProgramLoading,
    handleActivateProgram,
    activateProgramLoading,
    handleRenewProgram,
    renewProgramLoading,
    handleWithdrawProgram,
    withdrawProgramLoading,
    isFetchProgramsLoading,
    isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    handleTopUpProgram,
  };
};
