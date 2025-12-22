import { useCallback, useMemo } from 'react';
import { useMerchant } from '@/services/merchant/useMerchant';
import { useFocusEffect } from '@react-navigation/native';

export const useCustomers = () => {
  const { useFetchCustomersQuery, useFetchCustomerStatsQuery } = useMerchant();
  const {
    data: customersData,
    isLoading: isCustomersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchCustomersQuery();

  const {
    data: customerStats,
    isLoading: isCustomerStatsLoading,
    refetch: refetchCustomerStats,
    isError: isCustomerStatsError,
  } = useFetchCustomerStatsQuery();

  const customers = useMemo(() => {
    if (!customersData?.pages) return [];
    return customersData.pages.flatMap(page => page.items);
  }, [customersData]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchCustomerStats();
    }, [refetch, refetchCustomerStats])
  );

  return {
    customers,
    isCustomersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    customerStats,
    isCustomerStatsLoading,
    isCustomerStatsError,
  };
};
