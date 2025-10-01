import type { RootStackParamList } from "@/navigation/types";

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import { DrawerNavigator, Login, SignUp, Store } from "@/screens";
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
              <Stack.Screen component={DrawerNavigator} name={Paths.Drawer} />
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
