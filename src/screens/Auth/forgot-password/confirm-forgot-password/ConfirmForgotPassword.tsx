import { useConfirmForgotEmailPassword } from './useConfirmForgotPassword';
import { PrimaryButton, Typography, OTPInput } from '@/components';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import SafeScreen from '@/components/templates/SafeScreen';
import { ScrollView, View } from 'react-native';
import { styles } from './ConfirmForgotPassword.styles';
import { FormikProvider } from 'formik';

const ConfirmForgotPassword = ({ route }: RootScreenProps<Paths.CONFIRM_FORGOT_PASSWORD>) => {
  const { email } = route.params;

  const {
    formik,
    timeLeft,
    canResend,
    handleResendCode,
    verifyPasswordResetCodeLoading,
    handleChangeEmail,
  } = useConfirmForgotEmailPassword(email);

  return (
    <FormikProvider value={formik}>
      <SafeScreen style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
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

          <OTPInput
            value={formik.values.code}
            onChange={value => {
              formik.setFieldValue('code', Number(value));
              formik.setFieldTouched('code', true, false);
            }}
            error={formik.errors.code}
            touched={formik.touched.code}
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={verifyPasswordResetCodeLoading ? 'Loading...' : 'Change Password'}
            onPress={formik.handleSubmit}
            disabled={!formik.isValid || !formik.dirty}
          />
          <PrimaryButton
            label={canResend ? 'Resend Code' : `Resend in ${timeLeft}s`}
            onPress={handleResendCode}
            disabled={!canResend}
            icon={
              !canResend ? { name: 'request', color: '#595959', width: 14, height: 14 } : undefined
            }
          />
          <PrimaryButton
            label="Change email"
            onPress={handleChangeEmail}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </SafeScreen>
    </FormikProvider>
  );
};

export default ConfirmForgotPassword;
