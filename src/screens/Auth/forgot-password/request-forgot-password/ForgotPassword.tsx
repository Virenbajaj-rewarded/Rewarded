import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { FormikProvider } from 'formik';
import SafeScreen from '@/components/templates/SafeScreen';
import { Typography, TextField, PrimaryButton } from '@/components';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { styles } from './ForgotPassword.styles';
import { useForgotPassword } from './useForgotPassword';

function ForgotPassword({}: RootScreenProps<Paths.FORGOT_PASSWORD>) {
  const { formik, loading, handleCancel } = useForgotPassword();

  return (
    <FormikProvider value={formik}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeScreen style={styles.container}>
          <View style={styles.contentContainer}>
            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
              Enter your email, and we&apos;ll send you a verification code.
            </Typography>

            <TextField
              label="Email"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
            />
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label={loading ? 'Sending...' : 'Send Code'}
              onPress={formik.handleSubmit}
              disabled={!(formik.isValid && formik.dirty) || loading}
            />
            <PrimaryButton
              label="Cancel"
              onPress={handleCancel}
              style={styles.cancelButton}
              textStyle={styles.cancelText}
            />
          </View>
        </SafeScreen>
      </TouchableWithoutFeedback>
    </FormikProvider>
  );
}

export default ForgotPassword;
