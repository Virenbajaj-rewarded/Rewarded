import type { RootStackParamList } from "@/navigation/types";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import { Home, Login, SignUp } from "@/screens";

const Stack = createNativeStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Login} name={Paths.Login} />
          <Stack.Screen component={SignUp} name={Paths.SignUp} />
          <Stack.Screen component={Home} name={Paths.Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
