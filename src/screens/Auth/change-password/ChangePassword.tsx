import { View } from 'react-native';
import { Typography } from '@/components';
import { styles } from './ChangePassword.styles';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import SafeScreen from '@/components/templates/SafeScreen';

const ChangePassword = ({ navigation }: RootScreenProps<Paths.CHANGE_PASSWORD>) => {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
          Change Password
        </Typography>
      </View>
    </SafeScreen>
  );
};

export default ChangePassword;
