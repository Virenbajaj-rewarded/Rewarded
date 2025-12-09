import { useProgram } from '@/services/program/useProgram';
import { useMemo, useState } from 'react';
import { EProgramStatus, EProgramStrategy } from '@/enums';
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
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [selectedStopProgramId, setSelectedStopProgramId] = useState<
    string | null
  >(null);
  const [selectedStopProgramStrategy, setSelectedStopProgramStrategy] =
    useState<EProgramStrategy | null>(null);

  const activePrograms = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const handleStopProgram = (id: string, strategy: EProgramStrategy) => {
    setSelectedStopProgramId(id);
    setSelectedStopProgramStrategy(strategy);
    setIsStopModalOpen(true);
  };

  const handleStop = async (programId: string) => {
    await stopProgram(programId);
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
    isStopModalOpen,
    setIsStopModalOpen,
    selectedStopProgramId,
    selectedStopProgramStrategy,
    handleStop,
  };
};
