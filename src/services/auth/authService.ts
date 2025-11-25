import { instance } from '@/services/instance';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { IUserSignupFormValues } from '@/screens/Auth/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '@/screens/Auth/signup/merchant/SignupMerchant.types';
import { ISignupUserResponse, IHealthCheckResponse, ISignupMerchantResponse } from './auth.types';
import auth, {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { showToast } from '@/utils';

export const AuthServices = {
  healthCheck: async () => {
    const response = await instance.get<IHealthCheckResponse>('health');
    return response.json();
  },
  login: async (email: string, password: string) => {
    try {
      const response = await auth().signInWithEmailAndPassword(email.trim(), password);
      return response.user;
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to login',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
  signOut: async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to sign out',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
  signupUser: async (userData: IUserSignupFormValues): Promise<ISignupUserResponse> => {
    const { email, fullName, phoneNumber, password } = userData;
    try {
      await auth().createUserWithEmailAndPassword(email, password);

      const signupUserResponse = await instance.post<ISignupUserResponse>('auth/register', {
        json: {
          fullName,
          phoneNumber,
        },
      });
      return signupUserResponse.json();
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to sign up',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
  signupMerchant: async (userData: IMerchantSignupFormValues): Promise<ISignupMerchantResponse> => {
    const { email, fullName, businessName, phoneNumber, location, industry } = userData;
    const signupMerchantResponse = await instance.post<ISignupMerchantResponse>('merchants', {
      json: {
        fullName,
        businessName,
        email,
        phoneNumber,
        industry,
        location,
      },
    });
    return signupMerchantResponse.json();
  },
  signInWithGoogle: async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(getAuth(), googleCredential);

      try {
        const signupUserResponse = await instance.post<ISignupUserResponse>('auth/register');
        return signupUserResponse.json();
      } catch (registerError: any) {
        showToast({
          type: 'error',
          text1: 'Failed to sign in with Google',
          text2: registerError instanceof Error ? registerError.message : 'Unknown error',
        });
        if (registerError?.status === 409 || registerError?.status === 400) {
          throw registerError;
        }
        throw registerError;
      }
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to sign in with Google',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const changePasswordResponse = await instance.post('auth/change-password', {
        json: {
          oldPassword,
          newPassword,
        },
      });
      return changePasswordResponse.json();
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'An error occurred. Please try again later.',
      });
      throw error;
    }
  },
};
