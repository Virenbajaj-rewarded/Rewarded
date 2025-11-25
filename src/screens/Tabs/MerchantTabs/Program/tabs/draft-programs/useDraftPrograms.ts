import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus } from '@/enums';

export const useDraftPrograms = () => {
  const { useFetchProgramsQuery, activateProgram, activateProgramLoading } = useProgram();
  const {
    data,
    isLoading: isFetchProgramsLoading,
    isError: isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchProgramsQuery(EProgramStatus.DRAFT);

  const draftPrograms = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  const handleActivateProgram = async (id: string) => {
    await activateProgram(id);
  };

  return {
    draftPrograms,
    isFetchProgramsLoading,
    isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    handleActivateProgram,
    activateProgramLoading,
  };
};
