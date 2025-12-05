import ProgramList from '@/screens/Tabs/MerchantTabs/Program/components/ProgramList/ProgramList';
import { View, ActivityIndicator } from 'react-native';
import { Typography } from '@/components';
import { styles } from '../../pages/Program/Program.styles';
import { useActivePrograms } from './useActivePrograms';

export default function ActivePrograms() {
  const {
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
  } = useActivePrograms();

  if (isFetchProgramsLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
            Active Programs
          </Typography>
          <Typography fontVariant="regular" fontSize={16} color="#999999">
            View your active programs
          </Typography>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3c83f6" />
        </View>
      </View>
    );
  }

  if (isFetchProgramsError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
            Active Programs
          </Typography>
        </View>
        <View style={styles.errorContainer}>
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
            Something went wrong on active programs fetching
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <ProgramList
      programs={activePrograms}
      handleTopUpProgram={handleTopUpProgram}
      handleStopProgram={handleStopProgram}
      stopProgramLoading={stopProgramLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      refetch={refetch}
      isRefetching={isRefetching}
    />
  );
}
