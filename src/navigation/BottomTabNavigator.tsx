import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  RootScreenProps,
  UserTabStackParamList,
  MerchantTabStackParamList,
} from '@/navigation/types.ts';
import { UserTabPaths, MerchantTabPaths, Paths } from '@/navigation/paths.ts';
import { View } from 'react-native';

import Wallet from '@/screens/Tabs/UserTabs/Wallet/Wallet';
import MyStores from '@/screens/Tabs/UserTabs/MyStores/MyStores';
import Discover from '@/screens/Tabs/UserTabs/Discover/Discover';
import Expenses from '@/screens/Tabs/UserTabs/Expenses/Expenses';

import Customers from '@/screens/Tabs/MerchantTabs/Customers/Customers';
import Business from '@/screens/Tabs/MerchantTabs/Business/business-profile/Business';
import Request from '@/screens/Tabs/MerchantTabs/Request/Request';
import Program from '@/screens/Tabs/MerchantTabs/Program/pages/Program/Program';
import Balance from '@/screens/Tabs/MerchantTabs/Balance/Balance';

import IconByVariant from '@/components/atoms/IconByVariant';
import ProfileIcon from '@/components/templates/ProfileIcon/ProfileIcon';
import ScanQRButton from '@/components/molecules/ScanQRButton/ScanQRButton';
import { useAuth } from '@/services/auth/useAuth';
import { ERole } from '@/enums';

import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

export type BottomTabParamList = UserTabStackParamList & MerchantTabStackParamList;

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({
  navigation,
}: RootScreenProps<Paths.USER_TABS | Paths.MERCHANT_TABS>) {
  const { useFetchProfileQuery } = useAuth();
  const { data: profile } = useFetchProfileQuery();
  const role = profile?.role;
  const insets = useSafeAreaInsets();

  const tabScreenOptions: BottomTabNavigationOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: '#000000',
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      color: '#ffffff',
    },
    tabBarStyle: {
      backgroundColor: '#141414',
      borderTopColor: '#333333',
      borderTopWidth: 1,
      paddingTop: 10,
      height: 70 + insets.bottom,
    },
    tabBarActiveTintColor: '#3C83F6',
    tabBarInactiveTintColor: '#595959',
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '400',
    },
    headerLeft: () => {
      return (
        <View style={{ marginLeft: 16, marginBottom: 10, marginTop: 10, marginRight: 10 }}>
          <IconByVariant path="star" />
        </View>
      );
    },
    headerRight: () => {
      return (
        <ProfileIcon
          onPress={() => {
            navigation.navigate(Paths.PROFILE);
          }}
        />
      );
    },
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        {role === ERole.USER ? (
          <>
            <Tab.Screen
              name={UserTabPaths.DISCOVER}
              component={Discover}
              options={{
                tabBarLabel: 'Discover',
                headerTitle: 'Discover & Earn',
                tabBarIcon: ({ color }) => <IconByVariant path="search" color={color} />,
              }}
            />
            <Tab.Screen
              name={UserTabPaths.EXPENSES}
              component={Expenses}
              options={{
                tabBarLabel: 'Expenses',
                headerTitle: 'My Expenses',
                tabBarIcon: ({ color }) => <IconByVariant path="menu" color={color} />,
              }}
            />
            <Tab.Screen
              name={UserTabPaths.MY_STORES}
              component={MyStores}
              options={{
                tabBarLabel: 'Favourites',
                headerTitle: 'Favourites',
                tabBarIcon: ({ color }) => <IconByVariant path="heart-filled" color={color} />,
              }}
            />
            <Tab.Screen
              name={UserTabPaths.WALLET}
              component={Wallet}
              options={{
                tabBarLabel: 'Wallet',
                headerTitle: 'My Wallet',
                tabBarIcon: ({ color }) => <IconByVariant path="wallet" color={color} />,
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name={MerchantTabPaths.PROGRAM}
              component={Program}
              options={{
                tabBarLabel: 'Program',
                headerTitle: 'Program',
                tabBarIcon: ({ color }) => <IconByVariant path="menu" color={color} />,
              }}
            />
            <Tab.Screen
              name={MerchantTabPaths.CUSTOMERS}
              component={Customers}
              options={{
                tabBarLabel: 'Customers',
                headerTitle: 'Customers',
                tabBarIcon: ({ color }) => <IconByVariant path="customers" color={color} />,
              }}
            />
            <Tab.Screen
              name={MerchantTabPaths.BUSINESS}
              component={Business}
              options={{
                tabBarLabel: 'Business',
                headerTitle: 'Business',
                tabBarIcon: ({ color }) => <IconByVariant path="business" color={color} />,
              }}
            />
            <Tab.Screen
              name={MerchantTabPaths.BALANCE}
              component={Balance}
              options={{
                tabBarLabel: 'Balance',
                headerTitle: 'Balance',
                tabBarIcon: ({ color }) => <IconByVariant path="balance" color={color} />,
              }}
            />
            <Tab.Screen
              name={MerchantTabPaths.REQUEST}
              component={Request}
              options={{
                tabBarLabel: 'Request',
                headerTitle: 'Request',
                tabBarIcon: ({ color }) => <IconByVariant path="request" color={color} />,
              }}
            />
          </>
        )}
      </Tab.Navigator>
      <View style={[styles.scanButtonContainer, { bottom: 70 + insets.bottom + 16 }]}>
        <ScanQRButton />
      </View>
    </View>
  );
}
