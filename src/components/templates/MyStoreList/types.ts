import { IStoreListItem } from '@/services/stores/stores.types';

export type MyStoreListProps = {
  stores: IStoreListItem[];
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
  isRefetching: boolean;
  handleUnlikeStore: (id: string) => void;
};
