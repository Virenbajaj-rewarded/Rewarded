import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginUser,
  signupUser,
  signupMerchant,
  onboardMerchant,
  setMerchantPassword,
  logoutUser,
  getIsAuthenticated,
} from './authService';
import { IUserSignupFormValues } from '../../pages/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '../../pages/signup/merchant/SignupMerchant.types';
import { UserServices } from '../user/userService';

export const useAuth = () => {
  const queryClient = useQueryClient();

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
    onSuccess: async () => {
      // Fetch profile immediately after login and cache the role
      try {
        const profile = await UserServices.fetchProfile();
        if (profile?.role) {
          localStorage.setItem('userRole', profile.role);
        }
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
      queryClient.clear();
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
  };
};
