import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus } from '@/enums';

export const useActivePrograms = () => {
  const { stopProgram, stopProgramLoading, useFetchProgramsQuery } = useProgram();
  const {
    data,
    isLoading: isFetchProgramsLoading,
    isError: isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchProgramsQuery(EProgramStatus.ACTIVE);
  const activePrograms = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  const handleStopProgram = async (id: string) => {
    await stopProgram(id);
  };
  return {
    activePrograms,
    handleStopProgram,
    stopProgramLoading,
    isFetchProgramsLoading,
    isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  };
};
