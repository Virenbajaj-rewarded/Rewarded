import {
  InvalidateOptions,
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { getAuthState } from '@/services/auth/authStorage';
import { MerchantServices } from './merchantServices';
import { IGetMerchantResponse, IUpdateMerchantPayload } from './merchant.types';

export const enum MerchantQueryKey {
  fetchMerchantProfile = 'fetchMerchantProfile',
  fetchMerchantByBusinessCode = 'fetchMerchantByBusinessCode',
  fetchCustomerStats = 'fetchCustomerStats',
  fetchCustomers = 'fetchCustomers',
}

export const useFetchMerchantProfileQuery = () => {
  return useQuery({
    queryFn: () => MerchantServices.fetchMerchantProfile(),
    queryKey: [MerchantQueryKey.fetchMerchantProfile],
    enabled: getAuthState(),
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

export const useUpdateMerchantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateMerchantPayload) => MerchantServices.updateMerchant(data),
    onSuccess: updatedMerchant => {
      const currentMerchant = queryClient.getQueryData<IGetMerchantResponse>([
        MerchantQueryKey.fetchMerchantProfile,
      ]);
      const mergedMerchant = currentMerchant
        ? { ...currentMerchant, ...updatedMerchant }
        : updatedMerchant;
      queryClient.setQueryData([MerchantQueryKey.fetchMerchantProfile], mergedMerchant);
      queryClient.invalidateQueries({
        queryKey: [MerchantQueryKey.fetchMerchantProfile],
      });
    },
    onError: error => {
      console.error('Failed to update merchant:', error);
    },
  });
};

export const useUploadMerchantLogoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      logoUri,
      fileName,
      type,
    }: {
      logoUri: string;
      fileName: string;
      type: string;
    }) => MerchantServices.uploadMerchantLogo(logoUri, fileName, type),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MerchantQueryKey.fetchMerchantProfile],
      });
    },
    onError: error => {
      console.error('Failed to upload merchant logo:', error);
    },
  });
};

export const useFetchCustomerStatsQuery = () => {
  return useQuery({
    queryFn: () => MerchantServices.fetchCustomerStats(),
    // TODO: Remove this after push notifications are implemented
    refetchInterval: 5000,
    queryKey: [MerchantQueryKey.fetchCustomerStats],
  });
};

export const useFetchCustomersQuery = () =>
  useInfiniteQuery({
    queryKey: [MerchantQueryKey.fetchCustomers],
    queryFn: ({ pageParam = 1 }) => MerchantServices.fetchCustomers({ pageParam }),
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      const hasMore = page < Math.ceil(total / limit);
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    // TODO: Remove this after push notifications are implemented
    refetchInterval: 5000,
    staleTime: 180000,
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
    useUpdateMerchantMutation,
    useUploadMerchantLogoMutation,
    useFetchCustomerStatsQuery,
    useFetchCustomersQuery,
  };
};
