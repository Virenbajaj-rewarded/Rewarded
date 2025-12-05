import { MerchantTabPaths, Paths, UserTabPaths } from '@/navigation/paths';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { IProgram } from '@/interfaces';
import { ERole } from '@/enums';

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, S>;

export type UserTabCombinedScreenProps<
  R extends keyof UserTabStackParamList = keyof UserTabStackParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<UserTabStackParamList, R>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MerchantTabCombinedScreenProps<
  R extends keyof MerchantTabStackParamList = keyof MerchantTabStackParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<MerchantTabStackParamList, R>,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootStackParamList = {
  [Paths.USER_TABS]: NavigatorScreenParams<UserTabStackParamList>;
  [Paths.MERCHANT_TABS]: NavigatorScreenParams<MerchantTabStackParamList>;
  [Paths.STORE]: {
    businessCode: string;
  };
  [Paths.TOP_UP_STORE]: {
    userId: string;
    storeName: string;
  };
  [Paths.SCAN_STORE]: {
    businessCode: string;
  };
  [Paths.QR_SCANNER]: undefined;
  [Paths.QR_CODE]: {
    id: string;
  };
  [Paths.CREDIT_POINTS]: {
    userId: string;
  };
  [Paths.SCAN_USER]: {
    userId: string;
  };
  [Paths.REQUEST_POINTS]: {
    userId: string;
  };
  [Paths.LOGIN]: {
    role: ERole;
  };
  [Paths.FORGOT_PASSWORD]: undefined;
  [Paths.CONFIRM_FORGOT_PASSWORD]: {
    email: string;
  };
  [Paths.SET_NEW_PASSWORD]: {
    email: string;
    code: string;
  };
  [Paths.SIGNUP_MERCHANT]: undefined;
  [Paths.SIGNUP_USER]: undefined;
  [Paths.CHOOSE_ROLE]: undefined;
  [Paths.SIGNUP_MERCHANT_SUCCESS]: {
    email: string;
  };
  [Paths.CONFIRM_EMAIL]: {
    email: string;
  };
  [Paths.PROFILE]: undefined;
  [Paths.CHANGE_PASSWORD]: undefined;
  [Paths.SET_MERCHANT_PASSWORD]: {
    token: string;
  };
  [Paths.CREATE_PROGRAM]: undefined;
  [Paths.EDIT_PROGRAM]: {
    program: IProgram;
  };
  [Paths.PROGRAM_DETAILS]: {
    programId: string;
  };
  [Paths.TOP_UP_PROGRAM]: {
    program: IProgram;
  };
  [Paths.EDIT_BUSINESS]: undefined;
};

export type UserTabStackParamList = {
  [UserTabPaths.WALLET]: undefined;
  [UserTabPaths.DISCOVER]: undefined;
  [UserTabPaths.EXPENSES]: undefined;
  [UserTabPaths.MY_STORES]: undefined;
};

export type MerchantTabStackParamList = {
  [MerchantTabPaths.PROGRAM]: undefined;
  [MerchantTabPaths.CUSTOMERS]: undefined;
  [MerchantTabPaths.BUSINESS]: undefined;
  [MerchantTabPaths.BALANCE]: undefined;
  [MerchantTabPaths.REQUEST]: undefined;
};
