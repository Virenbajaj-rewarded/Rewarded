import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ActivePrograms from '@/screens/Tabs/MerchantTabs/Program/tabs/active-program/ActivePrograms';
import DraftPrograms from '@/screens/Tabs/MerchantTabs/Program/tabs/draft-programs/DraftPrograms';
import StoppedPrograms from '@/screens/Tabs/MerchantTabs/Program/tabs/stopped-programs/StoppedPrograms';

export type ProgramTabParamList = {
  Active: undefined;
  Drafts: undefined;
  Stopped: undefined;
};

const Tab = createMaterialTopTabNavigator<ProgramTabParamList>();

export function ProgramTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderBottomWidth: 1,
          borderBottomColor: '#1A1A1A',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#3c83f6',
          height: 2,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarActiveTintColor: '#3c83f6',
        tabBarInactiveTintColor: '#fff',
        swipeEnabled: true,
      }}
    >
      <Tab.Screen name="Active" component={ActivePrograms} />
      <Tab.Screen name="Drafts" component={DraftPrograms} />
      <Tab.Screen name="Stopped" component={StoppedPrograms} />
    </Tab.Navigator>
  );
}
