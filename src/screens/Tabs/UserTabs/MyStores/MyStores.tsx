import { View } from 'react-native';
import { useCallback } from 'react';
import { UserTabCombinedScreenProps } from '@/navigation/types.ts';
import { UserTabPaths } from '@/navigation/paths.ts';
import StoreList from '@/components/templates/StoreList/StoreList';
import { StoreListItem } from '@/components/molecules/Store';
import { useMyStores } from './useMyStores';
import { styles } from './MyStores.styles';
import { Modal, Selector } from '@/components';
import { formatStrategyLabel } from '@/utils';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { IStoreListItem } from '@/services/stores/stores.types';
import { ScrollView } from 'react-native-gesture-handler';

export default function MyStores({}: UserTabCombinedScreenProps<UserTabPaths.MY_STORES>) {
  const {
    stores,
    isFetchStoresLoading,
    isFetchStoresError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetchStoresRefetching,
    selectedStoreType,
    handleStoreTypeChange,
    industryOptions,
    isLeaveProgramModalOpen,
    selectedStore,
    closeLeaveProgramModal,
    handleUnlikeStore,
    leaveProgram,
  } = useMyStores();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IStoreListItem>) => {
      return <StoreListItem store={item} handleUnlikeStore={handleUnlikeStore} />;
    },
    [handleUnlikeStore]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Selector
          label="Industry"
          value={selectedStoreType}
          onValueChange={handleStoreTypeChange}
          options={industryOptions}
          placeholder="Select Industry"
        />
      </View>
      <StoreList
        stores={stores}
        isLoading={isFetchStoresLoading}
        isError={isFetchStoresError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        isRefetching={isFetchStoresRefetching}
        renderItem={renderItem}
      />
      <Modal
        visible={isLeaveProgramModalOpen}
        onClose={closeLeaveProgramModal}
        onCancel={closeLeaveProgramModal}
        submitButtonType="delete"
        title="Leave Program?"
        description={`If you leave ${selectedStore?.activeRewardProgram ? formatStrategyLabel(selectedStore?.activeRewardProgram) : ''} program at ${selectedStore?.name} program now, you might lose your ${selectedStore?.rewardPoints || 0} CAD points for this program. Are you sure?`}
        submitButtonLabel="Leave Program"
        cancelButtonLabel="Cancel"
        onSubmit={() => leaveProgram(selectedStore?.id ?? '')}
      />
    </ScrollView>
  );
}
