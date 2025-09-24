import type { RootStackParamList } from "@/navigation/types";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import { Login, SignUp } from "@/screens";
import { useAuth } from "@/services/auth/AuthProvider.tsx";
import React from "react";
import {
  DiscoverEarnScreen,
  MySpendingScreen,
  MyStoresScreen,
  MyWalletScreen,
} from "@/screens/Drawer";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        {user ? (
          <Drawer.Navigator
            key={variant}
            screenOptions={{
              headerShown: true,
              drawerType: "front",
              swipeEnabled: true,
            }}
          >
            <Drawer.Screen name="My Wallet" component={MyWalletScreen} />
            <Drawer.Screen name="My Stores" component={MyStoresScreen} />
            <Drawer.Screen
              name="Discover & Earn"
              component={DiscoverEarnScreen}
            />
            <Drawer.Screen name="My Spending" component={MySpendingScreen} />
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
            <Stack.Screen component={Login} name={Paths.Login} />
            <Stack.Screen component={SignUp} name={Paths.SignUp} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
