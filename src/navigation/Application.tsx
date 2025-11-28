import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import { navigationRef, resetToChooseRole } from '@/navigation/navigationRef';
import { useTheme } from '@/theme';

import {
  Login,
  ForgotPassword,
  Store,
  ScanStore,
  ConfirmEmail,
  QRScanner,
  MerchantQRPayment,
  Profile,
  SignupUser,
  SignupMerchant,
  ChooseRole,
  ChangePassword,
  SignupMerchantSuccess,
  QRCode,
  CreateProgram,
  EditProgram,
  ProgramDetails,
  ConfirmForgotPassword,
  SetNewPassword,
} from '@/screens';
import { EditBusiness } from '@/screens/Tabs/MerchantTabs/Business';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import { useAuth } from '@/services/auth/useAuth';
import { BackButton } from '@/components';
import { ERole } from '@/enums';

const Stack = createNativeStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();
  const { useFetchProfileQuery } = useAuth();

  const { data: profile } = useFetchProfileQuery();

  useEffect(() => {
    if (!profile && navigationRef.isReady()) {
      resetToChooseRole();
    }
  }, [profile]);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <Stack.Navigator
          key={variant}
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              color: '#ffffff',
            },
            headerLeft: () => <BackButton />,
          }}
        >
          {!profile ? (
            <>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                component={ChooseRole}
                name={Paths.CHOOSE_ROLE}
              />
              <Stack.Screen options={{ headerShown: false }} component={Login} name={Paths.LOGIN} />
              <Stack.Screen
                options={{
                  headerShown: true,
                  headerTitle: 'Forgot Password',
                }}
                component={ForgotPassword}
                name={Paths.FORGOT_PASSWORD}
              />
              <Stack.Screen
                options={{ headerShown: true, headerTitle: 'Check your email' }}
                component={ConfirmForgotPassword}
                name={Paths.CONFIRM_FORGOT_PASSWORD}
              />
              <Stack.Screen
                options={{ headerShown: true, headerTitle: 'Reset your password' }}
                component={SetNewPassword}
                name={Paths.SET_NEW_PASSWORD}
              />
              <Stack.Screen
                options={{ headerShown: true, headerTitle: 'Create Your account' }}
                component={SignupUser}
                name={Paths.SIGNUP_USER}
              />
              <Stack.Screen
                options={{ headerShown: true, headerTitle: 'Create Your account' }}
                component={SignupMerchant}
                name={Paths.SIGNUP_MERCHANT}
              />

              <Stack.Screen
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  headerBackVisible: false,
                }}
                component={SignupMerchantSuccess}
                name={Paths.SIGNUP_MERCHANT_SUCCESS}
              />
              <Stack.Screen
                options={{ headerShown: true, headerTitle: 'Confirm your email' }}
                component={ConfirmEmail}
                name={Paths.CONFIRM_EMAIL}
              />
            </>
          ) : (
            <>
              {profile.role === ERole.USER ? (
                <Stack.Group screenOptions={{ headerShown: true }}>
                  <Stack.Screen
                    options={{ headerShown: false }}
                    component={BottomTabNavigator}
                    name={Paths.USER_TABS}
                  />
                  <Stack.Screen
                    component={Store}
                    name={Paths.STORE}
                    options={{
                      headerTitle: 'Store',
                    }}
                  />
                  <Stack.Screen
                    component={ScanStore}
                    name={Paths.SCAN_STORE}
                    options={{
                      headerTitle: 'Store',
                    }}
                  />
                  <Stack.Screen
                    component={Profile}
                    name={Paths.PROFILE}
                    options={{
                      headerShown: true,
                      headerTitle: 'Profile',
                    }}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen component={BottomTabNavigator} name={Paths.MERCHANT_TABS} />
                  <Stack.Screen
                    options={{ headerShown: true, headerTitle: 'Create New Program' }}
                    component={CreateProgram}
                    name={Paths.CREATE_PROGRAM}
                  />
                  <Stack.Screen
                    options={{ headerShown: true, headerTitle: 'Edit Program' }}
                    component={EditProgram}
                    name={Paths.EDIT_PROGRAM}
                  />
                  <Stack.Screen
                    options={{ headerShown: true }}
                    component={ProgramDetails}
                    name={Paths.PROGRAM_DETAILS}
                  />
                  <Stack.Screen
                    component={Profile}
                    name={Paths.PROFILE}
                    options={{
                      headerShown: true,
                      headerTitle: 'Profile',
                    }}
                  />
                  <Stack.Screen
                    component={EditBusiness}
                    name={Paths.EDIT_BUSINESS}
                    options={{
                      headerShown: true,
                      headerTitle: 'Edit Business',
                    }}
                  />
                </Stack.Group>
              )}
            </>
          )}

          <Stack.Screen name={Paths.QR_SCANNER} component={QRScanner} />
          <Stack.Screen
            options={{ headerShown: true, headerTitle: 'My QR Code' }}
            name={Paths.QR_CODE}
            component={QRCode}
          />
          <Stack.Screen name={Paths.MERCHANT_QR_PAYMENT} component={MerchantQRPayment} />
          <Stack.Screen
            component={ChangePassword}
            name={Paths.CHANGE_PASSWORD}
            options={{
              headerShown: true,
              headerTitle: 'Change Password',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
