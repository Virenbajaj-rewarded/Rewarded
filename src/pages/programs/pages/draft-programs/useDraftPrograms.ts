import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';

export const useDraftPrograms = () => {
  const { useFetchProgramsQuery, activateProgram, activateProgramLoading } =
    useProgram();
  const {
    data,
    isLoading: isFetchProgramsLoading,
    isError: isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchProgramsQuery(EProgramStatus.DRAFT);

  const draftPrograms = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  return {
    draftPrograms,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchProgramsLoading,
    isFetchProgramsError,
    activateProgram,
    activateProgramLoading,
  };
};
