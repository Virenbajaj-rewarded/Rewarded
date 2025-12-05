import type { RootStackParamList } from '@/navigation/types';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Modal } from '@/components';
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
  CreditPoints,
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
  TopUpProgram,
  ConfirmForgotPassword,
  SetNewPassword,
  ScanUser,
  RequestPoints,
  TopUpStore,
} from '@/screens';
import { EditBusiness } from '@/screens/Tabs/MerchantTabs/Business';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import { useAuth } from '@/services/auth/useAuth';
import { BackButton } from '@/components';
import { ERole } from '@/enums';
import { useLedger } from '@/services/ledger/useLedger';
import { ICheckRequestsResponse } from '@/services/ledger/types';
const Stack = createNativeStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const [isRequestPointsModalVisible, setIsRequestPointsModalVisible] = useState(false);
  const [requestPointsModalData, setRequestPointsModalData] =
    useState<ICheckRequestsResponse | null>(null);
  const { navigationTheme, variant } = useTheme();
  const { useFetchProfileQuery } = useAuth();

  const { data: profile } = useFetchProfileQuery();
  const {
    checkRequests,
    seenByUser,
    approveRequest,
    declineRequest,
    approveRequestLoading,
    declineRequestLoading,
  } = useLedger();

  useEffect(() => {
    if (!profile && navigationRef.isReady()) {
      resetToChooseRole();
    }
  }, [profile]);

  const closeRequestPointsModal = async () => {
    setIsRequestPointsModalVisible(false);
    if (requestPointsModalData?.id) {
      await seenByUser(requestPointsModalData.id);
      setRequestPointsModalData(null);
    }
  };

  // TODO: Remove after Push notifications are implemented,
  useEffect(() => {
    if (profile?.role !== ERole.USER) {
      return;
    }

    const pollRequests = async () => {
      try {
        const response = await checkRequests();
        if (response.id) {
          setIsRequestPointsModalVisible(true);
          setRequestPointsModalData(response);
        }
        console.warn('response check from user', response);
      } catch (error) {
        console.error('Failed to check requests:', error);
      }
    };

    // Call immediately on mount
    pollRequests();

    // Then poll every 20 seconds
    const intervalId = setInterval(pollRequests, 10000);

    // Cleanup interval on unmount or when role changes
    return () => {
      clearInterval(intervalId);
    };
  }, [profile?.role, checkRequests]);

  const handleAcceptRequest = async () => {
    if (!requestPointsModalData?.id || approveRequestLoading || declineRequestLoading) {
      return;
    }
    try {
      await approveRequest(requestPointsModalData.id);
      closeRequestPointsModal();
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async () => {
    if (!requestPointsModalData?.id || approveRequestLoading || declineRequestLoading) {
      return;
    }
    try {
      await declineRequest(requestPointsModalData.id);
      closeRequestPointsModal();
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  };

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
                    component={TopUpStore}
                    name={Paths.TOP_UP_STORE}
                    options={{
                      headerTitle: '',
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
          <Stack.Screen
            options={{ headerShown: true }}
            name={Paths.CREDIT_POINTS}
            component={CreditPoints}
          />

          <Stack.Screen
            options={{ headerShown: true }}
            name={Paths.REQUEST_POINTS}
            component={RequestPoints}
          />

          <Stack.Screen
            options={{ headerShown: true }}
            name={Paths.SCAN_USER}
            component={ScanUser}
          />
          <Stack.Screen
            options={{ headerShown: true, headerTitle: '' }}
            name={Paths.TOP_UP_PROGRAM}
            component={TopUpProgram}
          />
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
      <Modal
        visible={isRequestPointsModalVisible}
        title="Withdrawal Request"
        description={
          requestPointsModalData
            ? `${requestPointsModalData.merchant?.businessName} requested to withdraw ${requestPointsModalData.amount} CAD points. Approve withdrawal? 
            ${requestPointsModalData.comment && `Comment: ${requestPointsModalData.comment}`}`
            : ''
        }
        submitButtonLabel={
          approveRequestLoading
            ? 'Approving...'
            : `Approve ${requestPointsModalData?.amount && `-${requestPointsModalData?.amount} CAD points`}`
        }
        cancelButtonLabel={declineRequestLoading ? 'Denying...' : 'Deny'}
        cancelButtonTextStyle={{ color: '#FF4D4F' }}
        onSubmit={handleAcceptRequest}
        onCancel={handleRejectRequest}
        onClose={() => {
          if (!approveRequestLoading && !declineRequestLoading) {
            closeRequestPointsModal();
          }
        }}
      />
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
