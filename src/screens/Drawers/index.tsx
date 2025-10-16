import { DrawerNavigationOptions } from '@react-navigation/drawer';

export const drawerScreenOptions: DrawerNavigationOptions = {
  headerShown: true,
  drawerType: 'front',
  swipeEnabled: true,
  drawerInactiveTintColor: '#ffffff',
  headerTitleStyle: {
    color: '#ffffff',
  },
};

export { default as UserDrawerNavigator } from './UserDrawer';
export { default as MerchantDrawerNavigator } from './MerchantDrawer';
