import { View } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';
import { styles } from './Business.styles';
import { Typography } from '@/components';

export default function Business({}: MerchantTabCombinedScreenProps<MerchantTabPaths.BUSINESS>) {
  return (
    <View style={styles.container}>
      <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
        Business
      </Typography>
      <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
        View your business and performance metrics
      </Typography>
    </View>
  );
}
