import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerStackParamList, RootScreenProps } from "@/navigation/types.ts";
import { DrawerPaths, Paths } from "@/navigation/paths.ts";
import Wallet from "@/screens/Drawer/Wallet";
import Stores from "@/screens/Drawer/Stores";
import DiscoverAndEarn from "@/screens/Drawer/DiscoverAndEarn";
import Spending from "@/screens/Drawer/Spending";

const Drawer = createDrawerNavigator<DrawerStackParamList>();

export default function DrawerNavigator({}: RootScreenProps<Paths.Drawer>) {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name={DrawerPaths.MY_WALLET}
        component={Wallet}
        options={{
          drawerActiveBackgroundColor: "#FFFFFF",
        }}
      />
      <Drawer.Screen name={DrawerPaths.STORES} component={Stores} />
      <Drawer.Screen
        name={DrawerPaths.DISCOVER_AND_EARN}
        component={DiscoverAndEarn}
      />
      <Drawer.Screen name={DrawerPaths.SPENDING} component={Spending} />
    </Drawer.Navigator>
  );
}
