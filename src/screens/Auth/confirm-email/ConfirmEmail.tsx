import { useConfirmEmail } from './useConfirmEmail';
import { PrimaryButton, Typography, OTPInput } from '@/components';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import SafeScreen from '@/components/templates/SafeScreen';
import { ScrollView, View } from 'react-native';
import { styles } from './ConfirmEmail.styles';
import { FormikProvider } from 'formik';

const ConfirmEmail = ({ route }: RootScreenProps<Paths.CONFIRM_EMAIL>) => {
  const { email } = route.params;

  const { formik, timeLeft, canResend, handleResendCode, confirmEmailLoading, handleChangeEmail } =
    useConfirmEmail();
  return (
    <FormikProvider value={formik}>
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
            label={confirmEmailLoading ? 'Loading...' : 'Create Account'}
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

export default ConfirmEmail;
