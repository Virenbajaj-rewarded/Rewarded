import { View } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';
import { styles } from './Request.styles';
import { Typography } from '@/components';

export default function Request({}: MerchantTabCombinedScreenProps<MerchantTabPaths.REQUEST>) {
  return (
    <View style={styles.container}>
      <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
        Request
      </Typography>
      <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
        View your request history
      </Typography>
    </View>
  );
}
