import { useProgram } from '@/services/program/useProgram';
import { useMemo, useState } from 'react';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';

export const useActivePrograms = () => {
  const {
    stopProgram,
    stopProgramLoading,
    topUpProgram,
    topUpProgramLoading,
    useFetchProgramsQuery,
  } = useProgram();
  const {
    data,
    isLoading: isFetchProgramsLoading,
    isError: isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchProgramsQuery(EProgramStatus.ACTIVE);

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);

  const activePrograms = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const handleStopProgram = async (id: string) => {
    await stopProgram(id);
  };

  const handleTopUpProgram = (program: IProgram) => {
    setSelectedProgram(program);
    setIsTopUpModalOpen(true);
  };

  const handleTopUp = async (programId: string, amount: number) => {
    await topUpProgram({ id: programId, amount });
  };

  return {
    activePrograms,
    handleStopProgram,
    stopProgramLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchProgramsLoading,
    isFetchProgramsError,
    handleTopUpProgram,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    selectedProgram,
    handleTopUp,
    topUpProgramLoading,
  };
};
