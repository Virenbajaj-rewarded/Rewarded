import { instance } from '@/services/instance';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { IUserSignupFormValues } from '@/screens/Auth/signup/user/SignupUser.types';
import { IMerchantSignupFormValues } from '@/screens/Auth/signup/merchant/SignupMerchant.types';
import { ERole } from '@/enums';
import auth, {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { showToast } from '@/utils';

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

export const AuthServices = {
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
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to sign in with Google',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
};
