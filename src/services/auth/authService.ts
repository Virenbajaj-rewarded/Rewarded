import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { api } from '@/lib/api';
import { IUserSignupFormValues } from '../../pages/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '../../pages/signup/merchant/SignupMerchant.types';
import { toast } from 'sonner';
import {
  IHealthCheckResponse,
  ISignupUserResponse,
  ISignupMerchantResponse,
  IOnboardMerchantResponse,
  ChangePasswordPayload,
} from './auth.types';

export const getIsAuthenticated = (): boolean => {
  const stored = localStorage.getItem('isAuthenticated');
  return stored === 'true';
};

export const healthCheck = async () => {
  const response = await api.get<IHealthCheckResponse>('/health');
  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  } catch (e) {
    console.error('Login error:', e);
    return false;
  }
};

export const signupUser = async (
  userData: IUserSignupFormValues
): Promise<ISignupUserResponse> => {
  const { email, fullName, phoneNumber, password } = userData;
  try {
    await createUserWithEmailAndPassword(auth, email, password);

    const signupUserResponse = await api.post<ISignupUserResponse>(
      '/auth/register',
      {
        fullName,
        phoneNumber,
      }
    );
    return signupUserResponse.data;
  } catch (e) {
    console.error('Signup error:', e);
  }
};

export const signupMerchant = async (
  userData: IMerchantSignupFormValues
): Promise<ISignupMerchantResponse> => {
  const { email, fullName, businessName, phoneNumber, location, industry } =
    userData;
  const signupMerchantResponse = await api.post<ISignupMerchantResponse>(
    '/merchants',
    {
      fullName,
      businessName,
      email,
      phoneNumber,
      industry,
      location,
    }
  );
  return signupMerchantResponse.data;
};

export const onboardMerchant = async (
  token: string
): Promise<IOnboardMerchantResponse> => {
  try {
    const response = await api.get<IOnboardMerchantResponse>(
      `/merchants/onboarding/${token}`
    );
    return response.data;
  } catch (e) {
    console.error('Error verifying set password token:', e);
  }
};

export const setMerchantPassword = async (
  password: string,
  email: string
): Promise<boolean> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);

    const signupUserResponse = await api.post<{ success: boolean }>(
      '/auth/register'
    );
    return signupUserResponse.data.success;
  } catch (e) {
    console.error('Signup error:', e);
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
  localStorage.setItem('isAuthenticated', 'false');
  localStorage.removeItem('userRole');
};

export const changePassword = async (
  data: ChangePasswordPayload
): Promise<boolean> => {
  const response = await api.post<{ success: boolean }>(
    '/auth/change-password',
    data
  );
  return response.data.success;
};

export const signInWithGoogle = async (): Promise<ISignupUserResponse> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    await signInWithPopup(auth, provider);

    try {
      const signupUserResponse =
        await api.post<ISignupUserResponse>('/auth/register');

      if (signupUserResponse) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', signupUserResponse.data.role);
      }

      return signupUserResponse.data;
    } catch (registerError: unknown) {
      toast.error('Failed to sign up');
      throw registerError;
    }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign up cancelled');
    }
    toast.error('Failed to sign up with Google');
    throw error;
  }
};
