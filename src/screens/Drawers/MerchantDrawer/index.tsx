import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import {
  MerchantDrawerStackParamList,
  RootScreenProps,
} from "@/navigation/types.ts";
import { MerchantDrawerPaths, Paths } from "@/navigation/paths.ts";

import { drawerScreenOptions } from "@/screens/Drawers";
import DrawerLayout from "@/screens/Drawers/DrawerLayout";
import MyStore from "@/screens/Drawers/MerchantDrawer/MyStore.tsx";

const MerchantDrawer = createDrawerNavigator<MerchantDrawerStackParamList>();

const drawerContent: Record<MerchantDrawerPaths, DrawerNavigationOptions> = {
  [MerchantDrawerPaths.MY_STORE]: {
    drawerLabel: "My Store",
    headerTitle: "My Store",
  },
};

export default function MerchantDrawerNavigator({}: RootScreenProps<Paths.MerchantDrawer>) {
  return (
    <MerchantDrawer.Navigator
      screenLayout={DrawerLayout}
      screenOptions={drawerScreenOptions}
    >
      <MerchantDrawer.Screen
        name={MerchantDrawerPaths.MY_STORE}
        component={MyStore}
        options={drawerContent[MerchantDrawerPaths.MY_STORE]}
      />
    </MerchantDrawer.Navigator>
  );
}
