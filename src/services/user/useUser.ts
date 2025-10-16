import { InvalidateOptions, useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { UserServices } from './userService';
import { User } from '@/services/user/schema';

export const enum UserQueryKey {
  fetchUserProfile = 'fetchUserProfile',
  fetchMerchantBalance = 'fetchMerchantBalance',
  fetchCustomerBalance = 'fetchCustomerBalance',
  fetchCustomerById = 'fetchCustomerById',
  updateUser = 'patchUserProfile',
}

const useFetchProfileQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchProfile(),
    queryKey: [UserQueryKey.fetchUserProfile],
    staleTime: 0,
  });

export const useFetchMerchantBalanceQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchMerchantBalance(),
    queryKey: [UserQueryKey.fetchMerchantBalance],
    staleTime: 300000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    placeholderData: {
      type: 'PAID',
      balance: 0,
    },
  });

export const useFetchCustomerBalanceQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchCustomerBalance(),
    queryKey: [UserQueryKey.fetchCustomerBalance],
    staleTime: 300000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    placeholderData: [
      {
        type: 'PAID',
        balance: 0,
      },
      {
        type: 'FREE',
        balance: 0,
      },
    ],
  });

export const useFetchCustomerById = (id?: string) =>
  useQuery({
    queryFn: () => UserServices.fetchUserById(id!),
    queryKey: [UserQueryKey.fetchCustomerById, id],
    staleTime: 60 * 1000,
    enabled: !!id,
  });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => UserServices.updateUser(data),
    onSuccess: updatedUser => {
      const currentUser = queryClient.getQueryData<User>([UserQueryKey.fetchUserProfile]);
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

  const setQueryData = (profile: User | null) => {
    client.setQueryData([UserQueryKey.fetchUserProfile], profile);
  };

  return {
    invalidateQuery,
    useFetchProfileQuery,
    setQueryData,
    useUpdateUserMutation,
  };
};
