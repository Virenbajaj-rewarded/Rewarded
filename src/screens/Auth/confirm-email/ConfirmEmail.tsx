import { useConfirmEmail } from './useConfirmEmail';
import { TextField, PrimaryButton, Typography } from '@/components';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import SafeScreen from '@/components/templates/SafeScreen';
import { ScrollView, View } from 'react-native';
import { styles } from './ConfirmEmail.styles';

const ConfirmEmail = ({ route }: RootScreenProps<Paths.CONFIRM_EMAIL>) => {
  const { email } = route.params;

  const { formik, timeLeft, canResend, handleResendCode, confirmEmailLoading } = useConfirmEmail();
  return (
    <SafeScreen style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Typography fontVariant="bold" fontSize={24} color="#FFFFFF" textAlign="center">
          Check your email
        </Typography>
        <Typography fontVariant="regular" fontSize={16} color="#BFBFBF" textAlign="center">
          {email ? (
            <>
              We&apos;ve sent you a 6-digit code to{' '}
              <Typography fontVariant="medium" fontSize={16} color="#FFFFFF">
                {email}
              </Typography>
              . To verify your account, please enter the code below.
            </>
          ) : (
            "We've sent you a 6-digit code to your email. To verify your account, please enter the code below."
          )}
        </Typography>

        <TextField
          label="Code"
          value={formik.values.code}
          onChangeText={formik.handleChange('code')}
          placeholder="Code"
          onBlur={formik.handleBlur('code')}
          error={formik.touched.code && formik.errors.code ? formik.errors.code : undefined}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          label={confirmEmailLoading ? 'Loading...' : 'Confirm Code'}
          onPress={formik.handleSubmit}
          disabled={!formik.isValid || !formik.dirty}
        />
        <PrimaryButton
          label={canResend ? 'Resend Code' : `Resend in ${timeLeft}s`}
          onPress={handleResendCode}
          disabled={!canResend}
        />
      </View>
    </SafeScreen>
  );
};

export default ConfirmEmail;
