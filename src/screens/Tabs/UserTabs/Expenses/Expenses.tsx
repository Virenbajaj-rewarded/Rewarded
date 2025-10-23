import { View } from 'react-native';
import { UserTabCombinedScreenProps } from '@/navigation/types.ts';
import { UserTabPaths } from '@/navigation/paths.ts';
import { Typography } from '@/components';
import { styles } from './Expenses.styles';

export default function Expenses({}: UserTabCombinedScreenProps<UserTabPaths.EXPENSES>) {
  return (
    <View style={styles.container}>
      <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
        Expenses
      </Typography>
    </View>
  );
}
