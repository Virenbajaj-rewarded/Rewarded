import { View, Text } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';

export default function Customers({}: MerchantTabCombinedScreenProps<MerchantTabPaths.CUSTOMERS>) {
  return (
    <View>
      <Text>Customers</Text>
    </View>
  );
}
