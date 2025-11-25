import ProgramList from '@/screens/Tabs/MerchantTabs/Program/components/ProgramList/ProgramList';
import { View, ActivityIndicator } from 'react-native';
import { Typography } from '@/components';
import { styles } from '../../pages/Program/Program.styles';
import { useStoppedPrograms } from './useStoppedPrograms';

export default function StoppedPrograms() {
  const {
    stoppedPrograms,
    handleRenewProgram,
    renewProgramLoading,
    handleWithdrawProgram,
    withdrawProgramLoading,
    isFetchProgramsLoading,
    isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useStoppedPrograms();

  if (isFetchProgramsLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
            Stopped Programs
          </Typography>
          <Typography fontVariant="regular" fontSize={16} color="#999999">
            View your stopped programs
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
            Stopped Programs
          </Typography>
        </View>
        <View style={styles.errorContainer}>
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
            Something went wrong on stopped programs fetching
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <ProgramList
      programs={stoppedPrograms}
      handleRenewProgram={handleRenewProgram}
      renewProgramLoading={renewProgramLoading}
      handleWithdrawProgram={handleWithdrawProgram}
      withdrawProgramLoading={withdrawProgramLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      refetch={refetch}
      isRefetching={isRefetching}
    />
  );
}
