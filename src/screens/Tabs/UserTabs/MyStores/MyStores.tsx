import { View } from 'react-native';
import { UserTabCombinedScreenProps } from '@/navigation/types.ts';
import { UserTabPaths } from '@/navigation/paths.ts';
import MyStoreList from '@/components/templates/MyStoreList';
import { useMyStores } from './useMyStores';
import { styles } from './MyStores.styles';
import { Modal, Selector } from '@/components';
import { formatStrategyLabel } from '../../MerchantTabs/Program/utils';

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

  return (
    <View style={styles.container}>
      <Selector
        label="Industry"
        value={selectedStoreType}
        onValueChange={handleStoreTypeChange}
        options={industryOptions}
        placeholder="Select Industry"
      />

      <MyStoreList
        stores={stores}
        isLoading={isFetchStoresLoading}
        isError={isFetchStoresError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        isRefetching={isFetchStoresRefetching}
        handleUnlikeStore={handleUnlikeStore}
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
    </View>
  );
}
