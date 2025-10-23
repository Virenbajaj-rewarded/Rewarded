import { View } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';
import { styles } from './Program.styles';
import { Typography } from '@/components';

export default function Program({}: MerchantTabCombinedScreenProps<MerchantTabPaths.PROGRAM>) {
  return (
    <View style={styles.container}>
      <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
        Program
      </Typography>
      <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
        View your program and rewards
      </Typography>
    </View>
  );
}
