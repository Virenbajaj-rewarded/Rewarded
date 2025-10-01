import { DrawerPaths, Paths } from "@/navigation/paths";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Store as StoreItem } from "@/hooks/domain/stores/schema.ts";

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = NativeStackScreenProps<RootStackParamList, S>;

export type DrawerCombinedScreenProps<
  R extends keyof DrawerStackParamList = keyof DrawerStackParamList,
> = CompositeScreenProps<
  DrawerScreenProps<DrawerStackParamList, R>,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootStackParamList = {
  [Paths.Drawer]: NavigatorScreenParams<DrawerStackParamList>;
  [Paths.Store]: {
    storeId: string;
    store?: StoreItem;
  };
  [Paths.Login]: undefined;
  [Paths.SignUp]: undefined;
};

export type DrawerStackParamList = {
  [DrawerPaths.MY_WALLET]: undefined;
  [DrawerPaths.DISCOVER_AND_EARN]: undefined;
  [DrawerPaths.SPENDING]: undefined;
  [DrawerPaths.STORES]: undefined;
};
