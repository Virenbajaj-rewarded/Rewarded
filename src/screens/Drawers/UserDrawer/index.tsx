import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import {
  UserDrawerStackParamList,
  RootScreenProps,
} from "@/navigation/types.ts";
import { UserDrawerPaths, Paths } from "@/navigation/paths.ts";
import { drawerScreenOptions } from "@/screens/Drawers";
import DrawerLayout from "@/screens/Drawers/DrawerLayout";
import Wallet from "@/screens/Drawers/UserDrawer/Wallet.tsx";
import Stores from "@/screens/Drawers/UserDrawer/Stores.tsx";
import DiscoverAndEarn from "@/screens/Drawers/UserDrawer/DiscoverAndEarn.tsx";
import Spending from "@/screens/Drawers/UserDrawer/Spending.tsx";

const UserDrawer = createDrawerNavigator<UserDrawerStackParamList>();

const drawerContent: Record<UserDrawerPaths, DrawerNavigationOptions> = {
  [UserDrawerPaths.STORES]: {
    drawerLabel: "My Stores",
    headerTitle: "My Stores",
  },
  [UserDrawerPaths.MY_WALLET]: {
    drawerLabel: "My Wallet",
    headerTitle: "My Wallet",
  },
  [UserDrawerPaths.DISCOVER_AND_EARN]: {
    drawerLabel: "Discover & Earn",
    headerTitle: "Discover & Earn",
  },
  [UserDrawerPaths.SPENDING]: {
    drawerLabel: "My Spending",
    headerTitle: "My Spending",
  },
};

export default function UserDrawerNavigator({}: RootScreenProps<Paths.UserDrawer>) {
  return (
    <UserDrawer.Navigator
      screenLayout={DrawerLayout}
      screenOptions={drawerScreenOptions}
    >
      <UserDrawer.Screen
        name={UserDrawerPaths.MY_WALLET}
        component={Wallet}
        options={drawerContent[UserDrawerPaths.MY_WALLET]}
      />
      <UserDrawer.Screen
        name={UserDrawerPaths.STORES}
        component={Stores}
        options={drawerContent[UserDrawerPaths.STORES]}
      />
      <UserDrawer.Screen
        name={UserDrawerPaths.DISCOVER_AND_EARN}
        component={DiscoverAndEarn}
        options={drawerContent[UserDrawerPaths.DISCOVER_AND_EARN]}
      />
      <UserDrawer.Screen
        name={UserDrawerPaths.SPENDING}
        component={Spending}
        options={drawerContent[UserDrawerPaths.SPENDING]}
      />
    </UserDrawer.Navigator>
  );
}
