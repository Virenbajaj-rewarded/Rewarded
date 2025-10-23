import { View } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';

import { styles } from './Customers.styles';
import { Typography } from '@/components';

export default function Customers({}: MerchantTabCombinedScreenProps<MerchantTabPaths.CUSTOMERS>) {
  return (
    <View style={styles.container}>
      <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
        Customers
      </Typography>
      <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
        View your customers and their spending history
      </Typography>
    </View>
  );
}
