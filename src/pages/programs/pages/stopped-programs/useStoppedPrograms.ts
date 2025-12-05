import { useProgram } from '@/services/program/useProgram';
import { useMemo, useState } from 'react';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';

export const useStoppedPrograms = () => {
  const {
    renewProgram,
    renewProgramLoading,
    withdrawProgram,
    withdrawProgramLoading,
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
  } = useFetchProgramsQuery(EProgramStatus.STOPPED);

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);

  const stoppedPrograms = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const handleRenewProgram = async (id: string) => {
    await renewProgram(id);
  };

  const handleWithdrawProgram = async (id: string) => {
    await withdrawProgram(id);
  };

  const handleTopUpProgram = (program: IProgram) => {
    setSelectedProgram(program);
    setIsTopUpModalOpen(true);
  };

  const handleTopUp = async (programId: string, amount: number) => {
    await topUpProgram({ id: programId, amount });
  };

  return {
    stoppedPrograms,
    handleRenewProgram,
    renewProgramLoading,
    handleWithdrawProgram,
    withdrawProgramLoading,
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
