import type { RootScreenProps } from '@/navigation/types';

import { useState } from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { z } from 'zod';

import { Paths } from '@/navigation/paths';

import IconByVariant from '@/components/atoms/IconByVariant';
import SafeScreen from '@/components/templates/SafeScreen';
import AuthTextInput from '@/components/auth/AuthTextInput/AuthTextInput.tsx';
import PrimaryButton from '@/components/auth/PrimaryButton/PrimaryButton.tsx';
import { useAuth } from '@/services/auth/AuthProvider.tsx';
import { styles } from './Login.styles';
import GoogleButton from '@/components/molecules/GoogleButton';

const loginSchema = z.object({
  email: z.email().min(1, { error: 'Email is required' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login({}: RootScreenProps<Paths.Login>) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState<LoginForm['email']>('');
  const [password, setPassword] = useState<LoginForm['password']>('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [authError, setAuthError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const isFormValid = loginSchema.safeParse({ email, password }).success;

  const onLogin = async () => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setAuthError(undefined);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const emailErr = fieldErrors.email?.[0];
      const passwordErr = fieldErrors.password?.[0];
      if (emailErr) setEmailError(emailErr);
      if (passwordErr) setPasswordError(passwordErr);
      return;
    }

    const { email: validEmail, password: validPassword } = result.data;

    try {
      setLoading(true);
      await signInWithEmail(validEmail, validPassword);
    } catch (error: unknown) {
      setAuthError((error as Error)?.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = () => {
    const result = loginSchema.pick({ email: true }).safeParse({ email });
    if (!result.success) {
      const err = result.error.flatten().fieldErrors.email?.[0];
      setEmailError(err);
    } else {
      setEmailError(undefined);
    }
  };
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError(undefined);
    if (authError) setAuthError(undefined);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError(undefined);
    if (authError) setAuthError(undefined);
  };

  return (
    <SafeScreen>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <IconByVariant path="droplet" height={55} width={55} stroke={'#3c83f6'} />
              <Text style={styles.headerTitle}>Rewarded</Text>
            </View>

            <View style={styles.inputWrapper}>
              <AuthTextInput
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                onBlur={handleEmailBlur}
                style={emailError ? styles.errorInput : undefined}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : undefined}
            </View>

            <View style={styles.inputWrapper}>
              <AuthTextInput
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Password"
                secureTextEntry
                style={passwordError ? styles.errorInput : undefined}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : undefined}

              {authError ? <Text style={styles.authErrorText}>{authError}</Text> : undefined}
            </View>

            <PrimaryButton
              label={loading ? 'Logging in...' : 'Log in'}
              onPress={onLogin}
              disabled={loading || !isFormValid}
              style={styles.loginButton}
            />

            <GoogleButton disabled={loading} />

            {/*<View*/}
            {/*  style={[layout.row, layout.justifyBetween, gutters.marginTop_16]}*/}
            {/*>*/}
            {/*  <TouchableOpacity*/}
            {/*    disabled={true}*/}
            {/*    onPress={() => navigation.navigate(Paths.SignUp)}*/}
            {/*    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}*/}
            {/*  >*/}
            {/*    <Text style={[fonts.size_12, { color: "#FFFFFF" }]}>*/}
            {/*      Create account*/}
            {/*    </Text>*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
}

export default Login;
