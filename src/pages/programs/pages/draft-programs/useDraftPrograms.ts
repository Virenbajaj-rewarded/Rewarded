import { useProgram } from '@/services/program/useProgram';
import { useMemo, useState } from 'react';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';

export const useDraftPrograms = () => {
  const {
    useFetchProgramsQuery,
    activateProgram,
    activateProgramLoading,
    topUpProgram,
    topUpProgramLoading,
  } = useProgram();
  const {
    data,
    isLoading: isFetchProgramsLoading,
    isError: isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchProgramsQuery(EProgramStatus.DRAFT);

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);

  const draftPrograms = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const handleTopUpProgram = (program: IProgram) => {
    setSelectedProgram(program);
    setIsTopUpModalOpen(true);
  };

  const handleTopUp = async (programId: string, amount: number) => {
    await topUpProgram({ id: programId, amount });
  };

  return {
    draftPrograms,
    handleTopUpProgram,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchProgramsLoading,
    isFetchProgramsError,
    activateProgram,
    activateProgramLoading,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    selectedProgram,
    handleTopUp,
    topUpProgramLoading,
  };
};
