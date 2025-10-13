import { ActivityIndicator, RefreshControl, Text, View } from 'react-native';

import { useCallback, useMemo } from 'react';

import { styles } from './MyStoreList.styles';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useMyStores } from '@/hooks/domain/stores/useStores.ts';
import Store from '@/components/molecules/Store';
import { Store as StoreItem } from '@/hooks/domain/stores/schema.ts';

export const mockStores = [
  {
    id: '1',
    businessName: 'Apple Store',
    businessEmail: 'apple@store.com',
    businessPhoneNumber: '+1 800 555 1234',
    businessAddress: '1 Infinite Loop, Cupertino, CA',
    tgUsername: 'apple_support',
    whatsppUsername: 'apple_whatsapp',
    logoKey: 'https://picsum.photos/id/1/200/300',
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-15T12:30:00.000Z',
  },
  {
    id: '2',
    businessName: 'Google Store',
    businessEmail: 'google@store.com',
    businessPhoneNumber: '+1 800 555 5678',
    businessAddress: '1600 Amphit heatre Parkway, Moun tain View, CA',
    tgUsername: 'google_support',
    whatsppUsername: null,
    logoKey: 'https://picsum.photos/id/1/200/300',
    createdAt: '2025-01-02T09:00:00.000Z',
    updatedAt: '2025-01-16T14:45:00.000Z',
  },
  {
    id: '3',
    businessName: 'Amazon Store',
    businessEmail: 'amazon@store.com',
    businessPhoneNumber: '+1 800 555 9999',
    businessAddress: '410 Terry Ave N, Seattle, WA',
    tgUsername: null,
    whatsppUsername: 'amazon_help',
    logoKey: 'https://picsum.photos/id/1/200/300',
    createdAt: '2025-01-03T08:00:00.000Z',
    updatedAt: '2025-01-20T18:20:00.000Z',
  },
  {
    id: '4',
    businessName: 'Samsung Store',
    businessEmail: 'samsung@store.com',
    businessPhoneNumber: '+82 2-2053-3000',
    businessAddress: 'Samsung Town, Seoul, South Korea',
    tgUsername: 'samsung_kr',
    whatsppUsername: 'samsung_help',
    logoKey: 'https://picsum.photos/id/1/200/300',
    createdAt: '2025-01-04T11:15:00.000Z',
    updatedAt: '2025-01-22T09:40:00.000Z',
  },
  {
    id: '5',
    businessName: 'Microsoft Store',
    businessEmail: 'microsoft@store.com',
    businessPhoneNumber: '+14258828080',
    businessAddress: '1 Microsoft Way, Redmond, WA',
    tgUsername: null,
    whatsppUsername: null,
    logoKey: 'https://picsum.photos/id/1/200/300',
    createdAt: '2025-01-05T07:30:00.000Z',
    updatedAt: '2025-01-23T16:10:00.000Z',
  },
];

function MyStoreList() {
  const { useFetchStoresQuery } = useMyStores();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchStoresQuery();

  const stores = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<StoreItem>) => {
    return <Store {...item} />;
  }, []);

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
        <Text style={styles.errorText}>Error loading stores</Text>
      </View>
    );
  }

  return (
    <FlashList<StoreItem>
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
}

MyStoreList.displayName = 'MyStoreList';

export default MyStoreList;
