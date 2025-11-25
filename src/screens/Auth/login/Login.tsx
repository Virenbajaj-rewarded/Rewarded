import type { RootScreenProps } from '@/navigation/types';
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { FormikProvider } from 'formik';
import IconByVariant from '@/components/atoms/IconByVariant';
import { TextField, PrimaryButton, Typography } from '@/components';
import { styles } from './Login.styles';
import GoogleButton from '@/components/molecules/GoogleButton';
import { Paths } from '@/navigation/paths';
import { useLogin } from './useLogin';
import { getAppVersionInfo } from '@/utils';

function Login({}: RootScreenProps<Paths.LOGIN>) {
  const {
    formik,
    loading,
    navigateToSignup,
    navigateToForgotPassword,
    handleSignInWithGoogle,
    signInWithGoogleLoading,
  } = useLogin();
  const { appVersion, buildNumber, envType } = getAppVersionInfo();

  return (
    <FormikProvider value={formik}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <IconByVariant path="droplet" height={55} width={55} stroke={'#3c83f6'} />
              <Typography fontVariant="bold" fontSize={24} color="#FFFFFF" textAlign="center">
                Welcome Back
              </Typography>
            </View>

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

            <TextField
              label="Password"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              placeholder="Password"
              secureTextEntry
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
            />

            <TouchableOpacity onPress={navigateToForgotPassword}>
              <Typography fontVariant="regular" fontSize={14} color="#3c83f6">
                Forgot password?
              </Typography>
            </TouchableOpacity>

            <PrimaryButton
              label={loading ? 'Signing in...' : 'Sign in'}
              onPress={formik.handleSubmit}
              disabled={!(formik.isValid && formik.dirty)}
              style={styles.loginButton}
            />

            <GoogleButton
              disabled={loading}
              onPress={handleSignInWithGoogle}
              loading={signInWithGoogleLoading}
            />

            <View style={styles.signupContainer}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                {`Don't have an account?`}
              </Typography>
              <PrimaryButton
                label="Sign up"
                onPress={navigateToSignup}
                style={styles.signupButton}
                textStyle={styles.signupText}
              />
            </View>

            <View style={styles.versionInfo}>
              <Typography
                fontVariant="regular"
                fontSize={11}
                color="#666666"
                style={styles.versionText}
              >
                {`Environment: ${envType.toUpperCase()}`}
              </Typography>
              <Typography
                fontVariant="regular"
                fontSize={11}
                color="#666666"
                style={styles.versionText}
              >
                {`Version: ${appVersion} (Build: ${buildNumber})`}
              </Typography>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </FormikProvider>
  );
}

export default Login;
