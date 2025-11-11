import { InvalidateOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFirebaseAuthState } from '@/services/firebase/useFirebaseAuthState';
import { MerchantServices } from './merchantServices';
import { IGetMerchantResponse } from './merchant.types';

export const enum MerchantQueryKey {
  fetchMerchantProfile = 'fetchMerchantProfile',
  fetchMerchantBalance = 'fetchMerchantBalance',
  fetchMerchantByBusinessCode = 'fetchMerchantByBusinessCode',
}

export const useFetchMerchantProfileQuery = () => {
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuthState();

  return useQuery({
    queryFn: () => MerchantServices.fetchMerchantProfile(),
    queryKey: [MerchantQueryKey.fetchMerchantProfile],
    enabled: isAuthenticated && !authLoading,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useFetchMerchantByBusinessCodeQuery = (businessCode: string) =>
  useQuery({
    queryFn: () => MerchantServices.fetchMerchantByBusinessCode(businessCode),
    queryKey: [MerchantQueryKey.fetchMerchantByBusinessCode],
    enabled: !!businessCode,
  });

export const useFetchMerchantBalanceQuery = () =>
  useQuery({
    queryFn: () => MerchantServices.fetchMerchantBalance(),
    queryKey: [MerchantQueryKey.fetchMerchantBalance],
    staleTime: 300000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    placeholderData: {
      points: 0,
      usd: 0,
      usdc: 0,
    },
  });

export const useMerchant = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: MerchantQueryKey[], options?: InvalidateOptions) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  const setQueryData = (profile: IGetMerchantResponse | null) => {
    client.setQueryData([MerchantQueryKey.fetchMerchantProfile], profile);
  };

  return {
    invalidateQuery,
    useFetchMerchantProfileQuery,
    setQueryData,
  };
};
