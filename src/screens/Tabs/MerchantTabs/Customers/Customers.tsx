import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';
import IconByVariant from '@/components/atoms/IconByVariant';
import { styles } from './Customers.styles';
import { Typography } from '@/components';
import { useCustomers } from './useCustomers';
import { useMemo } from 'react';
import { ICustomer } from '@/interfaces';

export default function Customers({}: MerchantTabCombinedScreenProps<MerchantTabPaths.CUSTOMERS>) {
  const {
    customers,
    isCustomersLoading,
    customerStats,
    isCustomerStatsLoading,
    isCustomerStatsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useCustomers();
  const { totalCustomers, newCustomersLastMonth, totalPointsCredited, totalPointsRedeemed } =
    customerStats || {};

  const renderItem = ({ item }: ListRenderItemInfo<ICustomer>) => {
    return (
      <View style={styles.customerItem}>
        <Typography fontVariant="bold" fontSize={16} color="#FFFFFF">
          {item.fullName}
        </Typography>
        <View style={styles.customerPoints}>
          <View style={styles.pointRow}>
            <IconByVariant path="spent" width={20} height={20} />
            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
              {item.spent}
            </Typography>
          </View>
          <View style={styles.pointRow}>
            <IconByVariant path="incoming" width={20} height={20} />
            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
              {item.earned}
            </Typography>
          </View>
        </View>
      </View>
    );
  };

  const keyExtractor = (item: ICustomer) => item.customerId;

  const ListHeaderComponent = useMemo(
    () => (
      <>
        <View style={styles.customersContainer}>
          <View style={styles.totalCustomersContainer}>
            <Typography fontVariant="regular" fontSize={14} color="#D8E6FD">
              Total Customers
            </Typography>
            {isCustomerStatsLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
                {totalCustomers || 0}
              </Typography>
            )}
          </View>
          <View style={styles.newCustomersContainer}>
            <Typography fontVariant="regular" fontSize={14} color="#8AB5FA">
              Joined Last Month
            </Typography>
            {isCustomerStatsLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
                {newCustomersLastMonth || 0}
              </Typography>
            )}
          </View>
        </View>

        <View style={styles.pointsContainerWrapper}>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsBalanceContainer}>
              <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
                Points Earned
              </Typography>
              <IconByVariant path="incoming" width={24} height={24} color="#FFFFFF" />
            </View>
            {isCustomerStatsLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                {totalPointsRedeemed || 0}
              </Typography>
            )}
          </View>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsBalanceContainer}>
              <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
                Points Spent
              </Typography>
              <IconByVariant path="spent" width={24} height={24} color="#FFFFFF" />
            </View>
            {isCustomerStatsLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                {totalPointsCredited || 0}
              </Typography>
            )}
          </View>
        </View>
      </>
    ),
    [
      totalCustomers,
      newCustomersLastMonth,
      totalPointsCredited,
      totalPointsRedeemed,
      isCustomerStatsLoading,
    ]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.stateContainer}>
        <Typography fontVariant="regular" fontSize={16} color="#666666">
          {isCustomersLoading ? 'Loading customers...' : 'No customers found'}
        </Typography>
      </View>
    ),
    [isCustomersLoading]
  );

  const ListFooterComponent = useMemo(
    () =>
      isFetchingNextPage ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={'#3c83f6'} />
        </View>
      ) : null,
    [isFetchingNextPage]
  );

  if (isCustomerStatsError) {
    return (
      <View style={styles.stateContainer}>
        <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
          Error loading customer stats
        </Typography>
      </View>
    );
  }

  return (
    <FlashList<ICustomer>
      data={customers}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.3}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching || false}
          onRefresh={refetch}
          colors={['#3c83f6']}
          tintColor={'#3c83f6'}
        />
      }
    />
  );
}
