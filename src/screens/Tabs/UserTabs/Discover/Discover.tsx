import { View, ActivityIndicator } from 'react-native';
import { useCallback } from 'react';
import { UserTabCombinedScreenProps } from '@/navigation/types.ts';
import { UserTabPaths } from '@/navigation/paths.ts';
import { styles } from './Discover.styles';
import { Typography, PrimaryButton, TextField, Selector } from '@/components';
import { useDiscover } from './useDiscover';
import StoreList from '@/components/templates/StoreList/StoreList';
import { StoreListItem } from '@/components/molecules/Store';

import IconByVariant from '@/components/atoms/IconByVariant';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { IStoreListItem } from '@/services/stores/stores.types';
import { Modal } from '@/components';
import { formatStrategyLabel } from '@/utils';
import { ScrollView } from 'react-native-gesture-handler';

export default function Discover({}: UserTabCombinedScreenProps<UserTabPaths.DISCOVER>) {
  const {
    stores,
    industryOptions,
    selectedStoreType,
    handleStoreTypeChange,
    searchQuery,
    handleSearchChange,
    isFetchStoresLoading,
    isFetchStoresError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetchStoresRefetching,
    handleLikeStore,
    handleUnlikeStore,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
    selectedStore,
    leaveProgram,
    handleNavigateToQR,
    balance,
    isBalanceLoading,
    isBalanceRefetching,
  } = useDiscover();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IStoreListItem>) => {
      return (
        <StoreListItem
          store={item}
          handleLikeStore={handleLikeStore}
          handleUnlikeStore={handleUnlikeStore}
        />
      );
    },
    [handleLikeStore, handleUnlikeStore]
  );

  return (
    <ScrollView keyboardDismissMode="on-drag" style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.pointsContainer}>
          <Typography fontVariant="regular" fontSize={14} color="#D8E6FD">
            Available CAD Points
          </Typography>
          {isBalanceLoading || isBalanceRefetching ? (
            <ActivityIndicator size="small" color="#3c83f6" />
          ) : (
            <Typography fontVariant="bold" fontSize={20} color="#FFFFFF">
              {balance || 0}
            </Typography>
          )}
        </View>

        <PrimaryButton
          label="My QR"
          onPress={handleNavigateToQR}
          icon={{ name: 'qr', color: '#FFFFFF', width: 16, height: 16 }}
          style={styles.qrButton}
        />

        <TextField
          placeholder="Search by business name or ID."
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
          returnKeyType="search"
          rightAction={<IconByVariant path="search" width={16} height={16} color="#8C8C8C" />}
        />

        <Selector
          value={selectedStoreType}
          onValueChange={handleStoreTypeChange}
          options={industryOptions}
          placeholder="All Industries"
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
