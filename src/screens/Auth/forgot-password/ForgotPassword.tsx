import { View } from 'react-native';
import SafeScreen from '@/components/templates/SafeScreen';
import { Typography } from '@/components';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { styles } from './ForgotPassword.styles';

function ForgotPassword({}: RootScreenProps<Paths.FORGOT_PASSWORD>) {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <Typography fontVariant="bold" fontSize={24} color="#FFFFFF" textAlign="center">
          Forgot Password
        </Typography>
      </View>
    </SafeScreen>
  );
}

export default ForgotPassword;
