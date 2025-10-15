import { StoreListItemType } from '@/services/stores/schema';

export type MyStoreListProps = {
  stores: StoreListItemType[];
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
  isRefetching: boolean;
};
