import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { UserDrawerCombinedScreenProps } from '@/navigation/types.ts';
import { UserDrawerPaths } from '@/navigation/paths.ts';
import MyStoreList from '@/components/templates/MyStoreList';
import { useMyStores } from '@/services/stores/useStores';
import { styles } from './UserStores.styles';
import { Typography } from '@/components';

export default function UserStores({}: UserDrawerCombinedScreenProps<UserDrawerPaths.STORES>) {
  const { useFetchStoresQuery, useFetchSavingsQuery } = useMyStores();

  const {
    data,
    isLoading: isFetchStoresLoading,
    isError: isFetchStoresError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching: isFetchStoresRefetching,
  } = useFetchStoresQuery();

  const { data: savings, isLoading: isFetchSavingsLoading } = useFetchSavingsQuery();

  const stores = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  return (
    <View style={styles.container}>
      <View style={styles.widgetsContainer}>
        <View style={styles.lifetimeSavings}>
          {isFetchSavingsLoading ? (
            <ActivityIndicator size="small" color="#3c83f6" />
          ) : (
            <>
              <Typography fontVariant="regular" fontSize={14} color="#D8E6FD">
                Lifetime Savings
              </Typography>
              <Typography fontVariant="medium" fontSize={20} color="#ffffff">
                {savings?.lifetimeSavingsUsd ? `$${savings?.lifetimeSavingsUsd}` : 'No savings yet'}
              </Typography>
            </>
          )}
        </View>

        <View style={styles.rewardPointsBalance}>
          {isFetchSavingsLoading ? (
            <ActivityIndicator size="small" color="#3c83f6" />
          ) : (
            <>
              <Typography fontVariant="regular" fontSize={14} color="#D8E6FD">
                Rewards Points
              </Typography>
              <Typography fontVariant="medium" fontSize={20} color="#ffffff">
                {savings?.rewardPointsBalance ? `${savings?.rewardPointsBalance}` : 'No points yet'}
              </Typography>
            </>
          )}
        </View>
      </View>

      {/* TODO: Add a dropdown with the stores types and filter the stores list */}

      <MyStoreList
        stores={stores}
        isLoading={isFetchStoresLoading}
        isError={isFetchStoresError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        isRefetching={isFetchStoresRefetching}
      />
    </View>
  );
}
