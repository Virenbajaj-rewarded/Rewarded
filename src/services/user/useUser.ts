import {
  InvalidateOptions,
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

import { UserServices } from './userService';
import { User } from './userService';
import { getIsAuthenticated } from '../auth';
import { toast } from 'sonner';

export const enum UserQueryKey {
  fetchUserProfile = 'fetchUserProfile',
  fetchCustomerById = 'fetchCustomerById',
  updateUser = 'patchUserProfile',
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

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => UserServices.updateUser(data),
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
