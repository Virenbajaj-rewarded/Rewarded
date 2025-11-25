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
} from './authService';
import { ChangePasswordPayload } from './auth.types';
import { IUserSignupFormValues } from '../../pages/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '../../pages/signup/merchant/SignupMerchant.types';
import { UserServices } from '../user/userService';
import { toast } from 'sonner';
import { useUser } from '../user/useUser';

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
      toast.error('An error occurred. Please try again later');
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
    healthCheck: healthCheckMutation.mutateAsync,
    invalidateQuery,
  };
};
