import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

export const useActivePrograms = () => {
  const navigation = useNavigation();
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
  const handleTopUpProgram = (program: IProgram) => {
    navigation.navigate(Paths.TOP_UP_PROGRAM, { program });
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
    handleTopUpProgram,
  };
};
