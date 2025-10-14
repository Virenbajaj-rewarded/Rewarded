import {
  useInfiniteQuery,
  useQueryClient,
  InvalidateOptions,
  useMutation,
} from '@tanstack/react-query';
import { StoresResponse } from './schema';
import { StoreServices } from '@/services/stores/storesService';

export const enum StoreQueryKey {
  fetchMyStores = 'fetchMyStores',
  fetchDeletedStores = 'fetchDeletedStores',
}

const useFetchStoresQuery = () =>
  useInfiniteQuery({
    queryKey: [StoreQueryKey.fetchMyStores],
    queryFn: ({ pageParam = 1 }) => StoreServices.fetchMyStores({ pageParam }),
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

export const useMyStores = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: StoreQueryKey[], options?: InvalidateOptions) =>
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
  };
};

export const useDeleteStore = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => StoreServices.deleteStore(id),
    onSuccess: id => {
      client.setQueryData<{ pages: StoresResponse[]; pageParams: unknown[] } | undefined>(
        [StoreQueryKey.fetchMyStores],
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              items: page.items.filter(store => store.id !== id),
            })),
          };
        }
      );

      client.invalidateQueries({
        queryKey: [StoreQueryKey.fetchDeletedStores],
      });
    },
  });
};

export const useRestoreStore = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => StoreServices.restoreStore(id),
    onSuccess: id => {
      client.setQueryData<{ pages: StoresResponse[]; pageParams: unknown[] } | undefined>(
        [StoreQueryKey.fetchDeletedStores],
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              items: page.items.filter(store => store.id !== id),
            })),
          };
        }
      );

      client.invalidateQueries({
        queryKey: [StoreQueryKey.fetchMyStores],
      });
    },
  });
};
