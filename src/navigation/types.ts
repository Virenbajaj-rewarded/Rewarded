import { MerchantTabPaths, Paths, UserTabPaths } from '@/navigation/paths';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

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
  [Paths.SCAN_STORE]: {
    businessCode: string;
  };
  [Paths.QR_SCANNER]: undefined;
  [Paths.QR_CODE]: {
    id: string;
  };
  [Paths.MERCHANT_QR_PAYMENT]: {
    consumerId: string;
  };
  [Paths.LOGIN]: undefined;
  [Paths.FORGOT_PASSWORD]: undefined;
  [Paths.SIGNUP_MERCHANT]: undefined;
  [Paths.SIGNUP_USER]: undefined;
  [Paths.SIGNUP_CHOOSE_ROLE]: undefined;
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
