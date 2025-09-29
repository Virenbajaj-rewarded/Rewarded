import { View } from "react-native";
import { DrawerCombinedScreenProps } from "@/navigation/types.ts";
import { DrawerPaths } from "@/navigation/paths.ts";
import React from "react";

export default function Wallet({}: DrawerCombinedScreenProps<DrawerPaths.MY_WALLET>) {
  return <View style={{ marginTop: 75 }}></View>;
}
