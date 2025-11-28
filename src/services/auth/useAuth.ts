import {
  useMutation,
  useQueryClient,
  InvalidateOptions,
} from '@tanstack/react-query';
import {
  loginUser,
  signupUser,
  signupMerchant,
  onboardMerchant,
  setMerchantPassword,
  logoutUser,
  getIsAuthenticated,
  changePassword,
  healthCheck,
  signInWithGoogle,
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword,
} from './authService';
import { ChangePasswordPayload } from './auth.types';
import { IUserSignupFormValues } from '../../pages/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '../../pages/signup/merchant/SignupMerchant.types';
import { UserServices } from '../user/userService';
import { toast } from 'sonner';
import { useUser } from '../user/useUser';
import { ERole } from '@/enums';

export const enum AuthQueryKey {
  login = 'login',
  signup = 'signup',
  signInWithGoogle = 'signInWithGoogle',
  changePassword = 'changePassword',
}

export const useAuth = () => {
  const client = useQueryClient();
  const { useFetchProfileQuery, setQueryData: setUserQueryData } = useUser();

  const { refetch } = useFetchProfileQuery();

  const healthCheckMutation = useMutation({
    mutationFn: () => healthCheck(),
    onError: error => {
      toast.error('Please try again later.');
      throw error;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await loginUser(email, password);
    },
    onSuccess: async data => {
      // Fetch profile immediately after login and cache the role
      try {
        const profile = await UserServices.fetchProfile();
        if (profile?.role) {
          localStorage.setItem('userRole', profile.role);
        }
        client.setQueryData([AuthQueryKey.login], data);
      } catch (error) {
        console.error('Failed to fetch profile after login:', error);
      }
    },
  });

  const signupUserMutation = useMutation({
    mutationFn: async (userData: IUserSignupFormValues) => {
      return await signupUser(userData);
    },
  });

  const signupMerchantMutation = useMutation({
    mutationFn: async (userData: IMerchantSignupFormValues) => {
      return await signupMerchant(userData);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      client.clear();
    },
  });

  const onboardMerchantMutation = useMutation({
    mutationFn: async (token: string) => {
      return await onboardMerchant(token);
    },
  });

  const setMerchantPasswordMutation = useMutation({
    mutationFn: async ({
      password,
      email,
    }: {
      password: string;
      email: string;
    }) => {
      return await setMerchantPassword(password, email);
    },
    onSuccess: () => {
      localStorage.setItem('userRole', ERole.MERCHANT);
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Registration completed successfully!');
    },
    onError: error => {
      console.error('Failed to set merchant password:', error);
      toast.error('Failed to set password!');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      return await changePassword(payload);
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: error => {
      console.error('Failed to change password:', error);
    },
  });

  const signInWithGoogleMutation = useMutation({
    mutationFn: () => signInWithGoogle(),
    onSuccess: data => {
      refetch();
      client.setQueryData([AuthQueryKey.signInWithGoogle], data);
    },
    onError: error => {
      console.error('error', error);
    },
  });

  const requestPasswordResetMutation = useMutation({
    mutationFn: async (email: string) => {
      return await requestPasswordReset(email);
    },
    onSuccess: () => {
      toast.success(
        'A password reset code has been sent to your email address'
      );
    },
    onError: error => {
      console.error('Failed to request password reset:', error);
    },
  });

  const verifyPasswordResetCodeMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      return await verifyPasswordResetCode(email, code);
    },
    onSuccess: () => {
      toast.success('Password reset code verified successfully');
    },
    onError: error => {
      console.error('Failed to verify password reset code:', error);
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
      return await resetPassword(email, code, newPassword);
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: error => {
      console.error('Failed to reset password:', error);
    },
  });

  const invalidateQuery = (
    queryKeys: AuthQueryKey[],
    options?: InvalidateOptions
  ) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  return {
    isAuthenticated: getIsAuthenticated(),
    login: loginMutation.mutateAsync,
    signupUser: signupUserMutation.mutateAsync,
    signupMerchant: signupMerchantMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isSignupUserLoading: signupUserMutation.isPending,
    isSignupMerchantLoading: signupMerchantMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
    signupUserError: signupUserMutation.error,
    signupMerchantError: signupMerchantMutation.error,
    logoutError: logoutMutation.error,
    onboardMerchant: onboardMerchantMutation.mutateAsync,
    setMerchantPassword: setMerchantPasswordMutation.mutateAsync,
    isOnboardMerchantLoading: onboardMerchantMutation.isPending,
    isSetMerchantPasswordLoading: setMerchantPasswordMutation.isPending,
    onboardMerchantError: onboardMerchantMutation.error,
    setMerchantPasswordError: setMerchantPasswordMutation.error,
    changePassword: changePasswordMutation.mutateAsync,
    isChangePasswordLoading: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
    signInWithGoogle: signInWithGoogleMutation.mutateAsync,
    isSignInWithGoogleLoading: signInWithGoogleMutation.isPending,
    signInWithGoogleError: signInWithGoogleMutation.error,
    requestPasswordReset: requestPasswordResetMutation.mutateAsync,
    isRequestPasswordResetLoading: requestPasswordResetMutation.isPending,
    verifyPasswordResetCode: verifyPasswordResetCodeMutation.mutateAsync,
    isVerifyPasswordResetCodeLoading: verifyPasswordResetCodeMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    healthCheck: healthCheckMutation.mutateAsync,
    invalidateQuery,
  };
};
