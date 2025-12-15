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
  getFirebaseErrorMessage: (error: unknown): string => {
    const firebaseError = error as { code?: string; message?: string };

    if (firebaseError.code === 'auth/email-already-in-use') {
      return 'This email is already registered. Please use a different email or try logging in.';
    }
    if (firebaseError.code === 'auth/invalid-email') {
      return 'Invalid email address. Please check your email and try again.';
    }
    if (firebaseError.code === 'auth/weak-password') {
      return 'Password is too weak. Please choose a stronger password.';
    }
    if (firebaseError.code === 'auth/network-request-failed') {
      return 'Network error. Please check your connection and try again.';
    }
    if (
      firebaseError.code === 'auth/wrong-password' ||
      firebaseError.code === 'auth/invalid-credential'
    ) {
      return 'Incorrect email or password. Please try again.';
    }
    if (firebaseError.code === 'auth/user-not-found') {
      return 'No account found with this email. Please sign up first.';
    }
    if (firebaseError.code === 'auth/too-many-requests') {
      return 'Too many attempts. Please wait a moment and try again.';
    }
    if (firebaseError.code === 'auth/user-disabled') {
      return 'This account has been disabled. Please contact support.';
    }
    if (firebaseError.code === 'auth/popup-closed-by-user') {
      return 'Sign-in was cancelled. Please try again to continue.';
    }

    return firebaseError.message || 'Something went wrong. Please try again later.';
  },
  healthCheck: async () => {
    const response = await instance.get<IHealthCheckResponse>('health');
    return response.json();
  },
  login: async (email: string, password: string) => {
    try {
      const response = await auth().signInWithEmailAndPassword(email.trim(), password);
      return response.user;
    } catch (error) {
      const errorMessage = AuthServices.getFirebaseErrorMessage(error);
      showToast({
        type: 'error',
        text1: errorMessage,
      });
      throw error;
    }
  },
  signOut: async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      const errorMessage = AuthServices.getFirebaseErrorMessage(error);
      showToast({
        type: 'error',
        text1: errorMessage,
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
      const errorMessage = AuthServices.getFirebaseErrorMessage(error);
      showToast({
        type: 'error',
        text1: errorMessage,
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
        const errorMessage = AuthServices.getFirebaseErrorMessage(registerError);
        showToast({
          type: 'error',
          text1: errorMessage,
        });
        if (registerError?.status === 409 || registerError?.status === 400) {
          throw registerError;
        }
        throw registerError;
      }
    } catch (error) {
      const errorMessage = AuthServices.getFirebaseErrorMessage(error);
      showToast({
        type: 'error',
        text1: errorMessage,
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
        text1: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
  requestPasswordReset: async (email: string): Promise<boolean> => {
    const response = await instance.post<{ success: boolean }>('auth/forgot-password/request', {
      json: { email },
    });

    return (await response.json()).success;
  },

  verifyPasswordResetCode: async (email: string, code: string): Promise<boolean> => {
    const response = await instance.post<{ success: boolean }>('auth/forgot-password/verify', {
      json: { email, code },
    });
    return (await response.json()).success;
  },

  resetPassword: async (email: string, code: string, newPassword: string): Promise<boolean> => {
    const response = await instance.post<{ success: boolean }>('auth/forgot-password/reset', {
      json: { email, code, newPassword },
    });
    return (await response.json()).success;
  },
};
