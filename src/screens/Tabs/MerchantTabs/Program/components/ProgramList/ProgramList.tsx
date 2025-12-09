import { useCallback, ReactNode } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { PrimaryButton, Typography } from '@/components';
import { styles } from './ProgramList.styles';

import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ProgramItem } from '../ProgramItem/ProgramItem';
import { EProgramStatusDisplayNames } from '@/enums';
import { usePrograms } from '@/screens/Tabs/MerchantTabs/Program/pages/Program/usePrograms';
import { CustomTabBar } from '../CustomTabBar/CustomTabBar';

type ProgramListProps = {
  activeTab: EProgramStatusDisplayNames;
  onTabChange: (tab: EProgramStatusDisplayNames) => void;
  headerComponent: ReactNode;
};

export default function ProgramList({ activeTab, onTabChange, headerComponent }: ProgramListProps) {
  const navigation = useNavigation();

  const {
    programs,
    handleStopProgram,
    stopProgramLoading,
    handleActivateProgram,
    activateProgramLoading,
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
    handleTopUpProgram,
  } = usePrograms(activeTab);

  const handleCreateProgram = useCallback(() => {
    navigation.navigate(Paths.CREATE_PROGRAM);
  }, [navigation]);

  const headerWithTabs = useCallback(
    () => (
      <View style={styles.listHeaderContainer}>
        {headerComponent}
        <CustomTabBar activeTab={activeTab} onTabChange={onTabChange} />
        <View style={styles.createButtonContainer}>
          <PrimaryButton
            label="Create New Program"
            onPress={handleCreateProgram}
            icon={{ name: 'plus', color: '#639CF8' }}
            style={styles.addProgramButtonStyle}
            textStyle={styles.addProgramButtonTextStyle}
          />
        </View>
      </View>
    ),
    [headerComponent, activeTab, onTabChange, handleCreateProgram]
  );

  if (isFetchProgramsLoading) {
    return (
      <View style={styles.listContainer}>
        {headerWithTabs()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3c83f6" />
        </View>
      </View>
    );
  }

  if (isFetchProgramsError) {
    return (
      <View style={styles.listContainer}>
        {headerWithTabs()}
        <View style={styles.errorContainer}>
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
            Something went wrong on programs fetching
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlashList
        data={programs}
        renderItem={({ item }) => (
          <ProgramItem
            program={item}
            handleTopUpProgram={handleTopUpProgram}
            handleActivateProgram={handleActivateProgram}
            activateProgramLoading={activateProgramLoading}
            handleStopProgram={handleStopProgram}
            stopProgramLoading={stopProgramLoading}
            handleWithdrawProgram={handleWithdrawProgram}
            withdrawProgramLoading={withdrawProgramLoading}
            handleRenewProgram={handleRenewProgram}
            renewProgramLoading={renewProgramLoading}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListHeaderComponent={headerWithTabs}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Typography fontVariant="regular" fontSize={16} color="#666666">
              No programs found
            </Typography>
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={'#3c83f6'} /> : null}
        refreshControl={
          refetch ? (
            <RefreshControl
              refreshing={isRefetching || false}
              onRefresh={refetch}
              colors={['#3c83f6']}
              tintColor={'#3c83f6'}
            />
          ) : undefined
        }
      />
    </View>
  );
}
