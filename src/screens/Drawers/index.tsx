import { DrawerNavigationOptions } from "@react-navigation/drawer";
import React from "react";
import LogoutButton from "@/components/atoms/LogoutButton";

export const drawerScreenOptions: DrawerNavigationOptions = {
  headerShown: true,
  drawerType: "front",
  swipeEnabled: true,
  drawerInactiveTintColor: "#ffffff",
  headerTitleStyle: {
    color: "#ffffff",
  },
  headerRight: () => {
    return <LogoutButton />;
  },
};

export { default as UserDrawerNavigator } from "./UserDrawer";
export { default as MerchantDrawerNavigator } from "./MerchantDrawer";
