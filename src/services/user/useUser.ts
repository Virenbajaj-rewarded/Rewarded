import {
  InvalidateOptions,
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { UserServices } from './userService';
import { IGetUserResponse } from '@/services/user/user.types';
import { getAuthState } from '@/services/auth/authStorage';

export const enum UserQueryKey {
  fetchUserProfile = 'fetchUserProfile',
  fetchBalance = 'fetchBalance',
  fetchUserById = 'fetchUserById',
  updateUser = 'patchUserProfile',
  fetchTransactionHistory = 'fetchTransactionHistory',
}

const useFetchProfileQuery = () => {
  return useQuery({
    queryFn: () => UserServices.fetchProfile(),
    queryKey: [UserQueryKey.fetchUserProfile],
    enabled: getAuthState(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useFetchBalanceQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchBalance(),
    queryKey: [UserQueryKey.fetchBalance],
    staleTime: 300000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    //TODO: Remove this after push notifications are implemented
    refetchInterval: 5000,
    placeholderData: 0,
  });

export const useFetchUserById = (id?: string) =>
  useQuery({
    queryFn: () => UserServices.fetchUserById(id!),
    queryKey: [UserQueryKey.fetchUserById, id],
    staleTime: 60 * 1000,
    enabled: !!id,
  });

export const useFetchTransactionHistoryQuery = () =>
  useInfiniteQuery({
    queryKey: [UserQueryKey.fetchTransactionHistory],
    queryFn: ({ pageParam = 1 }) => UserServices.fetchTransactionHistory({ pageParam }),
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

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IGetUserResponse>) => UserServices.updateUser(data),
    onSuccess: updatedUser => {
      const currentUser = queryClient.getQueryData<IGetUserResponse>([
        UserQueryKey.fetchUserProfile,
      ]);
      const mergedUser = currentUser ? { ...currentUser, ...updatedUser } : updatedUser;
      queryClient.setQueryData([UserQueryKey.fetchUserProfile], mergedUser);
      queryClient.invalidateQueries({
        queryKey: [UserQueryKey.fetchUserProfile],
      });
    },
    onError: error => {
      console.error('Failed to update user:', error);
    },
  });
};

export const useUser = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: UserQueryKey[], options?: InvalidateOptions) =>
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
    useFetchTransactionHistoryQuery,
  };
};
