import { View } from 'react-native';
import { Typography } from '@/components';
import { UserTabCombinedScreenProps } from '@/navigation/types.ts';
import { UserTabPaths } from '@/navigation/paths.ts';
import { styles } from './Discover.styles';

export default function Discover({}: UserTabCombinedScreenProps<UserTabPaths.DISCOVER>) {
  return (
    <View style={styles.container}>
      <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
        Discover and Earn
      </Typography>
    </View>
  );
}
