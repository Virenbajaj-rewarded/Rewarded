import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MerchantTabStackParamList, RootScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths, Paths } from '@/navigation/paths.ts';
import { View } from 'react-native';

import Customers from '@/screens/Tabs/MerchantTabs/Customers/Customers';
import Business from '@/screens/Tabs/MerchantTabs/Business/Business';
import Request from '@/screens/Tabs/MerchantTabs/Request/Request';
import Program from '@/screens/Tabs/MerchantTabs/Program/Program';
import Balance from '@/screens/Tabs/MerchantTabs/Balance/Balance';
import IconByVariant from '@/components/atoms/IconByVariant';
import { useTabScreenOptions } from '../index';
import ProfileIcon from '@/components/templates/ProfileIcon';
const MerchantTab = createBottomTabNavigator<MerchantTabStackParamList>();

export default function MerchantTabNavigator({ navigation }: RootScreenProps<Paths.MERCHANT_TABS>) {
  const tabScreenOptions = useTabScreenOptions();

  return (
    <MerchantTab.Navigator
      screenOptions={{
        ...tabScreenOptions,
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
                navigation.navigate(Paths.MERCHANT_PROFILE);
              }}
            />
          );
        },
      }}
    >
      <MerchantTab.Screen
        name={MerchantTabPaths.PROGRAM}
        component={Program}
        options={{
          tabBarLabel: 'Program',
          headerTitle: 'Program',
          tabBarIcon: ({ color }) => <IconByVariant path="menu" color={color} />,
        }}
      />

      <MerchantTab.Screen
        name={MerchantTabPaths.CUSTOMERS}
        component={Customers}
        options={{
          tabBarLabel: 'Customers',
          headerTitle: 'Customers',
          tabBarIcon: ({ color }) => <IconByVariant path="customers" color={color} />,
        }}
      />

      <MerchantTab.Screen
        name={MerchantTabPaths.BUSINESS}
        component={Business}
        options={{
          tabBarLabel: 'Business',
          headerTitle: 'Business',
          tabBarIcon: ({ color }) => <IconByVariant path="business" color={color} />,
        }}
      />

      <MerchantTab.Screen
        name={MerchantTabPaths.BALANCE}
        component={Balance}
        options={{
          tabBarLabel: 'Balance',
          headerTitle: 'Balance',
          tabBarIcon: ({ color }) => <IconByVariant path="balance" color={color} />,
        }}
      />
      <MerchantTab.Screen
        name={MerchantTabPaths.REQUEST}
        component={Request}
        options={{
          tabBarLabel: 'Request',
          headerTitle: 'Request',
          tabBarIcon: ({ color }) => <IconByVariant path="request" color={color} />,
        }}
      />
    </MerchantTab.Navigator>
  );
}
