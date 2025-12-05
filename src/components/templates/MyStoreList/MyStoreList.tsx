import { ActivityIndicator, RefreshControl, Text, View } from 'react-native';

import { useCallback } from 'react';

import { styles } from './MyStoreList.styles';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { StoreListItem } from '@/components/molecules/Store';
import { IStoreListItem } from '@/services/stores/stores.types';
import { MyStoreListProps } from './types';
import { Typography } from '@/components';

const MyStoreList = ({
  stores,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
  handleUnlikeStore,
}: MyStoreListProps) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IStoreListItem>) => {
      return <StoreListItem store={item} handleUnlikeStore={handleUnlikeStore} />;
    },
    [handleUnlikeStore]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={'#3c83f6'} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Typography fontVariant="regular" fontSize={16} color="#C13333">
          Something went wrong on store list fetching
        </Typography>
      </View>
    );
  }

  return (
    <FlashList<IStoreListItem>
      data={stores}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={'#3c83f6'} /> : null}
      ListEmptyComponent={() => {
        return (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No stores found</Text>
          </View>
        );
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={['#3c83f6']}
          tintColor={'#3c83f6'}
        />
      }
    />
  );
};

MyStoreList.displayName = 'MyStoreList';

export default MyStoreList;
