import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  InvalidateOptions,
  useMutation,
} from '@tanstack/react-query';
import { StoreServices } from '@/services/stores/storesService';
import { EIndustry } from '@/enums';
import { showToast } from '@/utils';

export const enum StoreQueryKey {
  fetchMyStores = 'fetchMyStores',
  fetchDeletedStores = 'fetchDeletedStores',
  fetchStore = 'fetchStore',
  fetchSavings = 'fetchSavings',
}

const useFetchMyStoresQuery = (storeType?: EIndustry | null) =>
  useInfiniteQuery({
    queryKey: [StoreQueryKey.fetchMyStores, storeType],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      StoreServices.fetchMyStores({
        pageParam,
        storeType: storeType,
      }),
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      const hasMore = page < Math.ceil(total / limit);
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 180000,
  });

const useFetchRemovedStoresQuery = () =>
  useInfiniteQuery({
    queryKey: [StoreQueryKey.fetchDeletedStores],
    queryFn: ({ pageParam = 1 }) => StoreServices.fetchRemovedStores({ pageParam }),
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      const hasMore = page < Math.ceil(total / limit);
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 180000,
  });

const useFetchStoreQuery = (id: string) =>
  useQuery({
    queryKey: [StoreQueryKey.fetchStore, id],
    queryFn: () => StoreServices.fetchStore(id),
    staleTime: 180000,
    //TODO: Remove this after push notifications are implemented
    refetchInterval: 5000,
  });

export const useMyStores = () => {
  const client = useQueryClient();

  const likeStoreMutation = useMutation({
    mutationFn: (id: string) => StoreServices.likeStore(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [StoreQueryKey.fetchMyStores],
      });

      client.invalidateQueries({
        queryKey: [StoreQueryKey.fetchStore],
      });
      showToast({
        type: 'success',
        text1: 'Added to my stores',
      });
    },
    onError: error => {
      console.error('Failed to like store:', error);
    },
  });

  const unlikeStoreMutation = useMutation({
    mutationFn: (id: string) => StoreServices.unlikeStore(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [StoreQueryKey.fetchMyStores],
      });
      client.invalidateQueries({
        queryKey: [StoreQueryKey.fetchStore],
      });
      showToast({
        type: 'success',
        text1: 'Removed from my stores',
      });
    },
    onError: error => {
      console.error('Failed to like store:', error);
    },
  });

  const invalidateQuery = (queryKeys: StoreQueryKey[], options?: InvalidateOptions) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  return {
    invalidateQuery,
    useFetchMyStoresQuery,
    useFetchRemovedStoresQuery,
    useFetchStoreQuery,
    unlikeStore: unlikeStoreMutation.mutateAsync,
    unlikeStoreLoading: unlikeStoreMutation.isPending,
    likeStore: likeStoreMutation.mutateAsync,
    likeStoreLoading: likeStoreMutation.isPending,
  };
};
