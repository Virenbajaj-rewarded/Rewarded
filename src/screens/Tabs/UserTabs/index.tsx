import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserTabStackParamList, RootScreenProps } from '@/navigation/types.ts';
import { UserTabPaths, Paths } from '@/navigation/paths.ts';
import { View } from 'react-native';
import Wallet from '@/screens/Tabs/UserTabs/Wallet/Wallet';
import MyStores from '@/screens/Tabs/UserTabs/MyStores/MyStores';
import Discover from '@/screens/Tabs/UserTabs/Discover/Discover';
import Expenses from '@/screens/Tabs/UserTabs/Expenses/Expenses';
import IconByVariant from '@/components/atoms/IconByVariant';
import { useTabScreenOptions } from '../index';
import ProfileIcon from '@/components/templates/ProfileIcon/ProfileIcon';

const UserTab = createBottomTabNavigator<UserTabStackParamList>();

export default function UserTabNavigator({ navigation }: RootScreenProps<Paths.USER_TABS>) {
  const tabScreenOptions = useTabScreenOptions();

  return (
    <UserTab.Navigator
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
                navigation.navigate(Paths.USER_PROFILE);
              }}
            />
          );
        },
      }}
    >
      <UserTab.Screen
        name={UserTabPaths.DISCOVER}
        component={Discover}
        options={{
          tabBarLabel: 'Discover',
          headerTitle: 'Discover & Earn',
          tabBarIcon: ({ color }) => <IconByVariant path="search" color={color} />,
        }}
      />
      <UserTab.Screen
        name={UserTabPaths.EXPENSES}
        component={Expenses}
        options={{
          tabBarLabel: 'Expenses',
          headerTitle: 'My Expenses',
          tabBarIcon: ({ color }) => <IconByVariant path="menu" color={color} />,
        }}
      />
      <UserTab.Screen
        name={UserTabPaths.MY_STORES}
        component={MyStores}
        options={{
          tabBarLabel: 'Favourites',
          headerTitle: 'Favourites',
          tabBarIcon: ({ color }) => <IconByVariant path="heart-filled" color={color} />,
        }}
      />
      <UserTab.Screen
        name={UserTabPaths.WALLET}
        component={Wallet}
        options={{
          tabBarLabel: 'Wallet',
          headerTitle: 'My Wallet',
          tabBarIcon: ({ color }) => <IconByVariant path="wallet" color={color} />,
        }}
      />
    </UserTab.Navigator>
  );
}
