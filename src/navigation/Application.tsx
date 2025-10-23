import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import {
  UserTabNavigator,
  MerchantTabNavigator,
  Login,
  SignUp,
  Store,
  QRScanner,
  MerchantQRPayment,
  UserProfile,
  MerchantProfile,
  ChangePassword,
} from '@/screens';
import { useAuth } from '@/services/auth/AuthProvider.tsx';

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
              <Stack.Screen component={Login} name={Paths.LOGIN} />
              <Stack.Screen component={SignUp} name={Paths.SIGN_UP} />
            </>
          ) : (
            <>
              {user.role === 'USER' ? (
                <Stack.Group>
                  <Stack.Screen component={UserTabNavigator} name={Paths.USER_TABS} />
                  <Stack.Group
                    screenOptions={{
                      headerShown: true,
                    }}
                  >
                    <Stack.Screen
                      component={Store}
                      name={Paths.STORE}
                      options={{
                        headerTitle: 'Store',
                        headerTitleStyle: {
                          color: '#ffffff',
                        },
                        headerBackTitle: 'Back',
                        headerTintColor: '#ffffff',
                      }}
                    />
                    <Stack.Screen
                      component={UserProfile}
                      name={Paths.USER_PROFILE}
                      options={{
                        headerTitle: 'Profile',
                        headerTitleStyle: {
                          color: '#ffffff',
                        },
                        headerBackTitle: 'Back',
                        headerTintColor: '#ffffff',
                      }}
                    />
                  </Stack.Group>
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen component={MerchantTabNavigator} name={Paths.MERCHANT_TABS} />
                  <Stack.Screen
                    component={MerchantProfile}
                    name={Paths.MERCHANT_PROFILE}
                    options={{
                      headerShown: true,
                      headerTitle: 'Profile',
                      headerTitleStyle: {
                        color: '#ffffff',
                      },
                      headerBackTitle: 'Back',
                      headerTintColor: '#ffffff',
                    }}
                  />
                </Stack.Group>
              )}
            </>
          )}
          <Stack.Screen name={Paths.QR_SCANNER} component={QRScanner} />
          <Stack.Screen name={Paths.MERCHANT_QR_PAYMENT} component={MerchantQRPayment} />
          <Stack.Screen
            component={ChangePassword}
            name={Paths.CHANGE_PASSWORD}
            options={{
              headerShown: true,
              headerTitle: 'Change Password',
              headerTitleStyle: {
                color: '#ffffff',
              },
              headerBackTitle: 'Profile',
              headerTintColor: '#ffffff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
