import type { RootStackParamList } from "@/navigation/types";

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import {
  DrawerNavigator,
  MerchantDrawerNavigator,
  Login,
  SignUp,
  Store,
  QRScanner,
  MerchantQRPayment,
} from "@/screens";
import { useAuth } from "@/services/auth/AuthProvider.tsx";

const Stack = createNativeStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          key={variant}
          screenOptions={{
            headerShown: false,
          }}
        >
          {!user ? (
            <>
              <Stack.Screen component={Login} name={Paths.Login} />
              <Stack.Screen component={SignUp} name={Paths.SignUp} />
            </>
          ) : (
            <>
              {user.role === "USER" ? (
                <Stack.Group>
                  <Stack.Screen
                    component={DrawerNavigator}
                    name={Paths.UserDrawer}
                  />
                  <Stack.Group
                    screenOptions={{
                      headerShown: true,
                    }}
                  >
                    <Stack.Screen
                      component={Store}
                      name={Paths.Store}
                      options={{
                        headerTitle: "Store",
                        headerTitleStyle: {
                          color: "#ffffff",
                        },
                        headerBackTitle: "Back",
                        headerTintColor: "#ffffff",
                      }}
                    />
                  </Stack.Group>
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen
                    component={MerchantDrawerNavigator}
                    name={Paths.MerchantDrawer}
                  />
                </Stack.Group>
              )}
            </>
          )}
          <Stack.Screen name={Paths.QR_SCANNER} component={QRScanner} />
          <Stack.Screen
            name={Paths.MERCHANT_QR_PAYMENT}
            component={MerchantQRPayment}
            options={{
              headerShown: true,
              headerTitle: "Top up / Withdraw points",
              headerTitleStyle: {
                color: "#ffffff",
              },
              headerBackTitle: "Back",
              headerTintColor: "#ffffff",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
