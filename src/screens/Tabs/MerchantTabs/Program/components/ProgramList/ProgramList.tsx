import { useCallback } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { PrimaryButton, Typography } from '@/components';
import { IProgram } from '@/interfaces';
import { styles } from './ProgramList.styles';

import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ProgramItem } from '../ProgramItem/ProgramItem';

interface ProgramListProps {
  programs: IProgram[];
  handleStopProgram?: (id: string) => void;
  stopProgramLoading?: boolean;
  handleWithdrawProgram?: (id: string) => void;
  withdrawProgramLoading?: boolean;
  handleRenewProgram?: (id: string) => void;
  renewProgramLoading?: boolean;
  handleActivateProgram?: (id: string) => void;
  activateProgramLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  refetch?: () => void;
  isRefetching?: boolean;
}

export default function ProgramList({
  programs,
  handleStopProgram,
  stopProgramLoading,
  handleActivateProgram,
  activateProgramLoading,
  handleWithdrawProgram,
  withdrawProgramLoading,
  handleRenewProgram,
  renewProgramLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
}: ProgramListProps) {
  const navigation = useNavigation();

  const handleCreateProgram = useCallback(() => {
    navigation.navigate(Paths.CREATE_PROGRAM);
  }, [navigation]);

  return (
    <View style={styles.listContainer}>
      <PrimaryButton
        label="Create New Program"
        onPress={handleCreateProgram}
        icon={{ name: 'plus', color: '#639CF8' }}
        style={styles.addProgramButtonStyle}
        textStyle={styles.addProgramButtonTextStyle}
      />
      <FlashList
        data={programs}
        renderItem={({ item }) => (
          <ProgramItem
            program={item}
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
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
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
