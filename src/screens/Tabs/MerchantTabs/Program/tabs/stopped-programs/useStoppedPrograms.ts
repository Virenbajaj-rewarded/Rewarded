import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus } from '@/enums';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { IProgram } from '@/interfaces';

export const useStoppedPrograms = () => {
  const navigation = useNavigation();
  const {
    renewProgram,
    renewProgramLoading,
    withdrawProgram,
    withdrawProgramLoading,
    useFetchProgramsQuery,
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
  } = useFetchProgramsQuery(EProgramStatus.STOPPED);

  const stoppedPrograms = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  const handleRenewProgram = async (id: string) => {
    await renewProgram(id);
  };
  const handleWithdrawProgram = async (id: string) => {
    await withdrawProgram(id);
  };
  const handleTopUpProgram = (program: IProgram) => {
    navigation.navigate(Paths.TOP_UP_PROGRAM, { program });
  };

  return {
    stoppedPrograms,
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
