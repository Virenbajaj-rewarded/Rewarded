import { InvalidateOptions, useQueryClient, useMutation } from '@tanstack/react-query';

import { UserQueryKey } from '@/services/user/useUser';
import { MerchantQueryKey } from '@/services/merchant/useMerchant';
import { AuthServices } from './authService';
import { useUser } from '@/services/user/useUser';
import { IUserSignupFormValues } from '@/screens/Auth/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '@/screens/Auth/signup/merchant/SignupMerchant.types';

export const enum AuthQueryKey {
  login = 'login',
  signup = 'signup',
  signInWithGoogle = 'signInWithGoogle',
}

export const useAuth = () => {
  const { useFetchProfileQuery, setQueryData: setUserQueryData } = useUser();

  const { refetch } = useFetchProfileQuery();

  const client = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthServices.login(email, password),
    onSuccess: data => {
      refetch();
      client.setQueryData([AuthQueryKey.login], data);
    },
    onError: error => {
      console.error('error', error);
    },
  });

  const signupUserMutation = useMutation({
    mutationFn: async (userData: IUserSignupFormValues) => {
      return await AuthServices.signupUser(userData);
    },
    onSuccess: data => {
      console.log('data', data);
    },
  });

  const signupMerchantMutation = useMutation({
    mutationFn: async (userData: IMerchantSignupFormValues) => {
      return await AuthServices.signupMerchant(userData);
    },
    onSuccess: data => {
      console.log('data', data);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await AuthServices.signOut();
    },
    onSuccess: () => {
      setUserQueryData(null);
      client.removeQueries({ queryKey: [UserQueryKey.fetchUserProfile] });
      client.removeQueries({ queryKey: [MerchantQueryKey.fetchMerchantBalance] });
      client.removeQueries({ queryKey: [UserQueryKey.fetchCustomerBalance] });
    },
  });

  const signInWithGoogleMutation = useMutation({
    mutationFn: () => AuthServices.signInWithGoogle(),
    onSuccess: data => {
      refetch();
      client.setQueryData([AuthQueryKey.signInWithGoogle], data);
    },
    onError: error => {
      console.error('error', error);
    },
  });

  const invalidateQuery = (queryKeys: AuthQueryKey[], options?: InvalidateOptions) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  return {
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    signupMerchant: signupMerchantMutation.mutateAsync,
    signupMerchantLoading: signupMerchantMutation.isPending,
    signupUser: signupUserMutation.mutateAsync,
    signupUserLoading: signupUserMutation.isPending,
    signOut: signOutMutation.mutateAsync,
    signOutLoading: signOutMutation.isPending,
    signInWithGoogle: signInWithGoogleMutation.mutateAsync,
    signInWithGoogleLoading: signInWithGoogleMutation.isPending,
    invalidateQuery,
    useFetchProfileQuery,
  };
};
