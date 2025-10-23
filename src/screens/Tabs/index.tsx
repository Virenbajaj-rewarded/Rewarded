import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useTabScreenOptions = (): BottomTabNavigationOptions => {
  const insets = useSafeAreaInsets();

  return {
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
  };
};
export { default as UserTabNavigator } from './UserTabs';
export { default as MerchantTabNavigator } from './MerchantTabs';
