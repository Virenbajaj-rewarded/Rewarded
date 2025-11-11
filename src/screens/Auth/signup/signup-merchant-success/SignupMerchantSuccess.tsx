import SafeScreen from '@/components/templates/SafeScreen';
import { Typography, PrimaryButton } from '@/components';
import IconByVariant from '@/components/atoms/IconByVariant';
import { useSignupMerchantSuccess } from './useSignupMerchantSuccess';
import { View } from 'react-native';
import { styles } from './SignupMerchantSuccess.styles';

import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';

const SignupMerchantSuccess = ({ route }: RootScreenProps<Paths.SIGNUP_MERCHANT_SUCCESS>) => {
  const { email } = route.params;
  const { handleNavigateToLogin } = useSignupMerchantSuccess();

  return (
    <SafeScreen>
      <View style={styles.container}>
        <IconByVariant path="warning" width={70} height={70} />
        <Typography fontVariant="medium" fontSize={24} color="#FFFFFF" textAlign="center">
          Complete Your Business Setup
        </Typography>
        <Typography fontVariant="regular" fontSize={14} color="#BFBFBF" textAlign="center">
          Verification may take up to 24 hours. Once complete, we’ll send a link to ${email} to
          finalize your business setup. If verification fails, you’ll receive an email with
          instructions to try again.
        </Typography>
        <PrimaryButton label="Go to Login" onPress={handleNavigateToLogin} style={styles.button} />
      </View>
    </SafeScreen>
  );
};

export default SignupMerchantSuccess;
