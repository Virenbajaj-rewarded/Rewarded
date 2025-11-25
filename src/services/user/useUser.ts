import { InvalidateOptions, useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useFirebaseAuthState } from '@/services/firebase/useFirebaseAuthState';
import { UserServices } from './userService';
import { IGetUserResponse } from '@/services/user/user.types';

export const enum UserQueryKey {
  fetchUserProfile = 'fetchUserProfile',
  fetchBalance = 'fetchBalance',
  fetchCustomerById = 'fetchCustomerById',
  updateUser = 'patchUserProfile',
}

const useFetchProfileQuery = () => {
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuthState();

  return useQuery({
    queryFn: () => UserServices.fetchProfile(),
    queryKey: [UserQueryKey.fetchUserProfile],
    enabled: isAuthenticated && !authLoading, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if it fails
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
