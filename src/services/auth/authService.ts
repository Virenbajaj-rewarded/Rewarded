import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { api } from '@/lib/api';
import { IUserSignupFormValues } from '../../pages/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '../../pages/signup/merchant/SignupMerchant.types';
import { ERole } from '@/enums';

export const getIsAuthenticated = (): boolean => {
  const stored = localStorage.getItem('isAuthenticated');
  return stored === 'true';
};

type ISignupUserResponse = {
  email: string;
  id: string;
  isEmailConfirmed: boolean;
  phoneNumber: string;
  role: ERole;
};

type ISignupMerchantResponse = {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type IOnboardMerchantResponse = {
  id: string;
  email: string;
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
