import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus } from '@/enums';

export const useStoppedPrograms = () => {
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
  };
};
