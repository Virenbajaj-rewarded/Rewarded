import {
  InvalidateOptions,
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { UserServices } from './userService';
import { IGetUserResponse } from './user.types';

import { getIsAuthenticated } from '../auth';
import { toast } from 'sonner';

export const enum UserQueryKey {
  fetchUserProfile = 'fetchUserProfile',
  fetchBalance = 'fetchBalance',
  fetchCustomerById = 'fetchCustomerById',
  updateUser = 'patchUserProfile',
  fetchTransactionHistory = 'fetchTransactionHistory',
}

const useFetchProfileQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchProfile(),
    queryKey: [UserQueryKey.fetchUserProfile],
    staleTime: 0,
    enabled: getIsAuthenticated(),
  });

export const useFetchCustomerById = (id?: string) =>
  useQuery({
    queryFn: () => UserServices.fetchUserById(id!),
    queryKey: [UserQueryKey.fetchCustomerById, id],
    staleTime: 60 * 1000,
    enabled: !!id,
  });

export const useFetchBalanceQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchBalance(),
    queryKey: [UserQueryKey.fetchBalance],
    staleTime: 300000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    placeholderData: 0,
  });

export const useFetchTransactionHistoryQuery = () =>
  useInfiniteQuery({
    queryKey: [UserQueryKey.fetchTransactionHistory],
    queryFn: ({ pageParam = 1 }) =>
      UserServices.fetchTransactionHistory({ pageParam }),
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      const hasMore = page < Math.ceil(total / limit);
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 180000,
  });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IGetUserResponse>) =>
      UserServices.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UserQueryKey.fetchUserProfile],
      });
      toast.success('Changes Saved');
    },
    onError: error => {
      console.error('Failed to update user:', error);
    },
  });
};

export const useUser = () => {
  const client = useQueryClient();

  const invalidateQuery = (
    queryKeys: UserQueryKey[],
    options?: InvalidateOptions
  ) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  const setQueryData = (profile: IGetUserResponse | null) => {
    client.setQueryData([UserQueryKey.fetchUserProfile], profile);
  };

  return {
    invalidateQuery,
    useFetchProfileQuery,
    setQueryData,
    useUpdateUserMutation,
  };
};
