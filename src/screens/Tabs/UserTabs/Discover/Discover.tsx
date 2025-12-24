import { View, Text } from 'react-native';
import { UserTabCombinedScreenProps } from '@/navigation/types';
import { UserTabPaths } from '@/navigation/paths';

export default function Discover({}: UserTabCombinedScreenProps<UserTabPaths.DISCOVER>) {
  return (
    <View>
      <Text>Discover</Text>
    </View>
  );
}
