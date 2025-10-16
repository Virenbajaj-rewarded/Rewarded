import { MerchantDrawerPaths, Paths, UserDrawerPaths } from '@/navigation/paths';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, S>;

export type UserDrawerCombinedScreenProps<
  R extends keyof UserDrawerStackParamList = keyof UserDrawerStackParamList,
> = CompositeScreenProps<
  DrawerScreenProps<UserDrawerStackParamList, R>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MerchantDrawerCombinedScreenProps<
  R extends keyof MerchantDrawerStackParamList = keyof MerchantDrawerStackParamList,
> = CompositeScreenProps<
  DrawerScreenProps<MerchantDrawerStackParamList, R>,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootStackParamList = {
  [Paths.UserDrawer]: NavigatorScreenParams<UserDrawerStackParamList>;
  [Paths.MerchantDrawer]: NavigatorScreenParams<MerchantDrawerStackParamList>;
  [Paths.Store]: {
    storeId: string;
  };
  [Paths.QR_SCANNER]: undefined;
  [Paths.MERCHANT_QR_PAYMENT]: {
    consumerId: string;
  };
  [Paths.Login]: undefined;
  [Paths.SignUp]: undefined;
  [Paths.USER_PROFILE]: undefined;
};

export type UserDrawerStackParamList = {
  [UserDrawerPaths.MY_WALLET]: undefined;
  [UserDrawerPaths.DISCOVER_AND_EARN]: undefined;
  [UserDrawerPaths.SPENDING]: undefined;
  [UserDrawerPaths.STORES]: undefined;
};

export type MerchantDrawerStackParamList = {
  [MerchantDrawerPaths.MY_STORE]: undefined;
};
