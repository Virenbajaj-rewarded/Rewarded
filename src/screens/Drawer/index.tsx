import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerStackParamList, RootScreenProps } from "@/navigation/types.ts";
import { DrawerPaths, Paths } from "@/navigation/paths.ts";
import Wallet from "@/screens/Drawer/Wallet";
import Stores from "@/screens/Drawer/Stores";
import DiscoverAndEarn from "@/screens/Drawer/DiscoverAndEarn";
import Spending from "@/screens/Drawer/Spending";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/services/auth/AuthProvider.tsx";
import Layout from "@/screens/Drawer/Layout.tsx";

const Drawer = createDrawerNavigator<DrawerStackParamList>();

export default function DrawerNavigator({
  navigation,
}: RootScreenProps<Paths.Drawer>) {
  const { signOut } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <Drawer.Navigator
      screenLayout={Layout}
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        swipeEnabled: true,
        drawerInactiveTintColor: "#ffffff",
        headerTitleStyle: {
          color: "#ffffff",
        },
        headerRight: () => {
          return (
            <View style={{ marginRight: 10 }}>
              {loggingOut ? (
                <ActivityIndicator size="small" color="#3c83f6" />
              ) : (
                <TouchableOpacity
                  hitSlop={{ right: 10, top: 10, bottom: 10, left: 10 }}
                  onPress={() => {
                    Alert.alert(
                      "Are you sure you want to logout?",
                      "",
                      [
                        {
                          text: "No",
                          style: "cancel",
                        },
                        {
                          text: "Yes",
                          onPress: async () => {
                            setLoggingOut(true);
                            signOut().finally(() => setLoggingOut(false));
                          },
                        },
                      ],
                      { cancelable: true },
                    );
                  }}
                >
                  <MaterialIcons name="logout" size={24} color="#3c83f6" />
                </TouchableOpacity>
              )}
            </View>
          );
        },
      }}
    >
      <Drawer.Screen
        name={DrawerPaths.MY_WALLET}
        component={Wallet}
        options={{
          drawerLabel: "My Wallet",
          headerTitle: "My Wallet",
        }}
      />
      <Drawer.Screen
        name={DrawerPaths.STORES}
        component={Stores}
        options={{
          drawerLabel: "My Stores",
          headerTitle: "My Stores",
        }}
      />
      <Drawer.Screen
        name={DrawerPaths.DISCOVER_AND_EARN}
        component={DiscoverAndEarn}
        options={{
          drawerLabel: "Discover & Earn",
          headerTitle: "Discover & Earn",
        }}
      />
      <Drawer.Screen
        name={DrawerPaths.SPENDING}
        component={Spending}
        options={{
          drawerLabel: "My Spending",
          headerTitle: "My Spending",
        }}
      />
    </Drawer.Navigator>
  );
}
