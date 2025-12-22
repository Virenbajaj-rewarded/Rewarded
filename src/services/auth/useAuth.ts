import { InvalidateOptions, useQueryClient, useMutation } from '@tanstack/react-query';

import { UserQueryKey } from '@/services/user/useUser';
import { AuthServices } from './authService';
import { useUser } from '@/services/user/useUser';
import { IUserSignupFormValues } from '@/screens/Auth/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '@/screens/Auth/signup/merchant/SignupMerchant.types';
import { showToast } from '@/utils';
import { clearAuthState, setAuthState } from './authStorage';
import { navigate } from '@/navigation/navigationRef';
import { Paths } from '@/navigation/paths';

export const enum AuthQueryKey {
  login = 'login',
  signup = 'signup',
  signInWithGoogle = 'signInWithGoogle',
  changePassword = 'changePassword',
}

export const useAuth = () => {
  const { useFetchProfileQuery, setQueryData: setUserQueryData } = useUser();

  const { refetch, data: profile } = useFetchProfileQuery();

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
    onSuccess: async data => {
      const email = data.email || '';
      try {
        const refetchResult = await refetch({ throwOnError: true });
        const userRole = refetchResult.data?.role || profile?.role;
        client.setQueryData([AuthQueryKey.login], data);
        setAuthState(true, userRole);
      } catch (error: any) {
        if (error?.status === 403 || error?.response?.status === 403) {
          if (email) {
            navigate(Paths.CONFIRM_EMAIL, { email });
            return;
          }
        }
        throw error;
      }
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
      clearAuthState();
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
      setAuthState(true, profile?.role);
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

  const requestPasswordResetMutation = useMutation({
    mutationFn: async (email: string) => {
      return await AuthServices.requestPasswordReset(email);
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        text1: 'A password reset code has been sent to your email address',
      });
    },
    onError: error => {
      console.error('Failed to request password reset:', error);
      showToast({
        type: 'error',
        text1: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });

  const verifyPasswordResetCodeMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      return await AuthServices.verifyPasswordResetCode(email, code);
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        text1: 'Password reset code verified successfully',
      });
    },
    onError: error => {
      console.error('Failed to verify password reset code:', error);
      showToast({
        type: 'error',
        text1: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({
      email,
      code,
      newPassword,
    }: {
      email: string;
      code: string;
      newPassword: string;
    }) => {
      return await AuthServices.resetPassword(email, code, newPassword);
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        text1: 'Password reset successfully',
      });
    },
    onError: error => {
      console.error('Failed to reset password:', error);
      showToast({
        type: 'error',
        text1: error instanceof Error ? error.message : 'Unknown error',
      });
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
    requestPasswordReset: requestPasswordResetMutation.mutateAsync,
    requestPasswordResetLoading: requestPasswordResetMutation.isPending,
    verifyPasswordResetCode: verifyPasswordResetCodeMutation.mutateAsync,
    verifyPasswordResetCodeLoading: verifyPasswordResetCodeMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    resetPasswordLoading: resetPasswordMutation.isPending,
    invalidateQuery,
    useFetchProfileQuery,
    healthCheck: healthCheckMutation.mutateAsync,
  };
};
