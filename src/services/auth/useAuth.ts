import { InvalidateOptions, useQueryClient, useMutation } from '@tanstack/react-query';

import { UserQueryKey } from '@/services/user/useUser';
import { AuthServices } from './authService';
import { useUser } from '@/services/user/useUser';
import { IUserSignupFormValues } from '@/screens/Auth/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '@/screens/Auth/signup/merchant/SignupMerchant.types';
import { showToast } from '@/utils';

export const enum AuthQueryKey {
  login = 'login',
  signup = 'signup',
  signInWithGoogle = 'signInWithGoogle',
  changePassword = 'changePassword',
}

export const useAuth = () => {
  const { useFetchProfileQuery, setQueryData: setUserQueryData } = useUser();

  const { refetch } = useFetchProfileQuery();

  const client = useQueryClient();

  const healthCheckMutation = useMutation({
    mutationFn: () => AuthServices.healthCheck(),
    onError: error => {
      showToast({
        type: 'error',
        text1: 'Health check failed',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });

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
  });

  const signupMerchantMutation = useMutation({
    mutationFn: async (userData: IMerchantSignupFormValues) => {
      return await AuthServices.signupMerchant(userData);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await AuthServices.signOut();
    },
    onSuccess: () => {
      setUserQueryData(null);
      client.removeQueries({ queryKey: [UserQueryKey.fetchUserProfile] });
      client.removeQueries({ queryKey: [UserQueryKey.fetchBalance] });
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

  const changePasswordMutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      AuthServices.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      showToast({
        type: 'success',
        text1: 'Your password was successfully updated',
      });
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
    changePassword: changePasswordMutation.mutateAsync,
    changePasswordLoading: changePasswordMutation.isPending,
    invalidateQuery,
    useFetchProfileQuery,
    healthCheck: healthCheckMutation.mutateAsync,
  };
};
