import { ActivityIndicator, RefreshControl, Text, View } from 'react-native';

import { useCallback } from 'react';

import { styles } from './StoreList.styles';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { IStoreListItem } from '@/services/stores/stores.types';
import { StoreListProps } from './types';
import { Typography } from '@/components';

const StoreList = ({
  stores,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
  renderItem,
  listHeaderComponent,
}: StoreListProps) => {
  const renderItemCallback = useCallback(
    (info: ListRenderItemInfo<IStoreListItem>) => {
      return renderItem(info);
    },
    [renderItem]
  );

  return (
    <FlashList<IStoreListItem>
      data={stores}
      renderItem={renderItemCallback}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.3}
      ListHeaderComponent={listHeaderComponent ? () => listHeaderComponent : undefined}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={'#3c83f6'} /> : null}
      ListEmptyComponent={() => {
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
          <View style={styles.center}>
            <Text style={styles.emptyText}>No stores found</Text>
          </View>
        );
      }}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

StoreList.displayName = 'StoreList';

export default StoreList;
