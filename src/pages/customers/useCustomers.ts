import { useFetchCustomersQuery } from '@/services/merchant/useMerchant';
import { useMemo } from 'react';

export const useCustomers = () => {
  const {
    data: customersData,
    isLoading: isCustomersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchCustomersQuery();

  const customers = useMemo(
    () => customersData?.pages.flatMap(page => page.items) || [],
    [customersData]
  );

  return {
    customers,
    isCustomersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  };
};
