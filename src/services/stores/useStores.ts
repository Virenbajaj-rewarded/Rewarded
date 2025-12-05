import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  InvalidateOptions,
  useMutation,
} from '@tanstack/react-query';
import { StoreServices } from '@/services/stores/storesService';
import { EIndustry } from '@/enums';
import { toast } from 'sonner';

export const enum StoreQueryKey {
  fetchMyStores = 'fetchMyStores',
  fetchDeletedStores = 'fetchDeletedStores',
  fetchStore = 'fetchStore',
  fetchSavings = 'fetchSavings',
}

const useFetchStoresQuery = (storeType?: EIndustry | null) =>
  useInfiniteQuery({
    queryKey: [StoreQueryKey.fetchMyStores, storeType ?? null],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      StoreServices.fetchMyStores({
        pageParam,
        storeType,
      }),
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      const hasMore = page < Math.ceil(total / limit);
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 180000,
    retry: false,
  });

const useFetchRemovedStoresQuery = () =>
  useInfiniteQuery({
    queryKey: [StoreQueryKey.fetchDeletedStores],
    queryFn: ({ pageParam = 1 }) =>
      StoreServices.fetchRemovedStores({ pageParam }),
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
  });

const useFetchSavingsQuery = () =>
  useQuery({
    queryKey: [StoreQueryKey.fetchSavings],
    queryFn: () => StoreServices.fetchSavings(),
    staleTime: 300000,
  });

export const useMyStores = () => {
  const client = useQueryClient();

  const likeStoreMutation = useMutation({
    mutationFn: (id: string) => StoreServices.likeStore(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [StoreQueryKey.fetchMyStores],
      });
      toast.success('Added to my stores');
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
      toast.success('Removed from my stores');
    },
    onError: error => {
      console.error('Failed to like store:', error);
    },
  });

  const invalidateQuery = (
    queryKeys: StoreQueryKey[],
    options?: InvalidateOptions
  ) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  return {
    invalidateQuery,
    useFetchStoresQuery,
    useFetchRemovedStoresQuery,
    useFetchStoreQuery,
    useFetchSavingsQuery,
    unlikeStore: unlikeStoreMutation.mutateAsync,
    unlikeStoreLoading: unlikeStoreMutation.isPending,
    likeStore: likeStoreMutation.mutateAsync,
    likeStoreLoading: likeStoreMutation.isPending,
  };
};
