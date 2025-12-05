import { InvalidateOptions, useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { UserServices } from './userService';
import { IGetUserResponse } from '@/services/user/user.types';
import { getAuthState } from '@/services/auth/authStorage';

export const enum UserQueryKey {
  fetchUserProfile = 'fetchUserProfile',
  fetchBalance = 'fetchBalance',
  fetchUserById = 'fetchUserById',
  updateUser = 'patchUserProfile',
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
    placeholderData: 0,
  });

export const useFetchUserById = (id?: string) =>
  useQuery({
    queryFn: () => UserServices.fetchUserById(id!),
    queryKey: [UserQueryKey.fetchUserById, id],
    staleTime: 60 * 1000,
    enabled: !!id,
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
  };
};
