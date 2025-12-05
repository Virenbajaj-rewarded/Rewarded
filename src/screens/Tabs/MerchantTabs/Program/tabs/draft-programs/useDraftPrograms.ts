import { useProgram } from '@/services/program/useProgram';
import { useMemo } from 'react';
import { EProgramStatus } from '@/enums';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { IProgram } from '@/interfaces';

export const useDraftPrograms = () => {
  const navigation = useNavigation();
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

  const handleTopUpProgram = (program: IProgram) => {
    navigation.navigate(Paths.TOP_UP_PROGRAM, { program });
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
    handleTopUpProgram,
  };
};
