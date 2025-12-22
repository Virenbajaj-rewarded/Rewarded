import { ReactElement } from 'react';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { IStoreListItem } from '@/services/stores/stores.types';

export type StoreListProps = {
  stores: IStoreListItem[];
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
  isRefetching: boolean;
  renderItem: (info: ListRenderItemInfo<IStoreListItem>) => ReactElement;
  listHeaderComponent?: ReactElement;
};
