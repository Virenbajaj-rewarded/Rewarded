import ProgramList from '@/screens/Tabs/MerchantTabs/Program/components/ProgramList/ProgramList';
import { EProgramStatus } from '@/enums';
import { useProgram } from '@/services/program/useProgram';
import { View, ActivityIndicator } from 'react-native';
import { Typography } from '@/components';
import { styles } from '../Program.styles';

export default function DraftPrograms() {
  const { useFetchProgramsQuery } = useProgram();
  const {
    data,
    isLoading: isFetchProgramsLoading,
    isError: isFetchProgramsError,
  } = useFetchProgramsQuery();
  const programs = data?.items || [];

  if (isFetchProgramsLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
            Draft Programs
          </Typography>
          <Typography fontVariant="regular" fontSize={16} color="#999999">
            View your draft programs
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
            Draft Programs
          </Typography>
        </View>
        <View style={styles.errorContainer}>
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
            Something went wrong on draft programs fetching
          </Typography>
        </View>
      </View>
    );
  }
  return <ProgramList programs={programs} status={EProgramStatus.DRAFT} />;
}
