import type { RootScreenProps } from '@/navigation/types';

import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import { IconByVariant } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';
import AuthTextInput from '@/components/auth/AuthTextInput';
import PrimaryButton from '@/components/auth/PrimaryButton';

const VALID_EMAIL = 'v.yuskiv@sda.company';
const VALID_PASSWORD = 'qwerty';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: 'Email is required' })
    .email({ error: 'Enter a valid email address' }),
  password: z
    .string()
    .min(1, { error: 'Password is required' }),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { gutters, layout, fonts, colors } = useTheme();
  const [email, setEmail] = useState<LoginForm['email']>('');
  const [password, setPassword] = useState<LoginForm['password']>('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [authError, setAuthError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // Derived validity state: enable button only when form is valid per Zod schema
  const isFormValid = loginSchema.safeParse({ email, password }).success;

  const onLogin = () => {
    // Reset errors first
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

    // Simulate request delay similar to Startup screen behavior
    setLoading(true);
    setTimeout(() => {
      if (validEmail === VALID_EMAIL && validPassword === VALID_PASSWORD) {
        navigation.reset({ index: 0, routes: [{ name: Paths.Home }] });
      } else {
        setAuthError('Invalid email or password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <SafeScreen>
      <View style={[layout.flex_1, layout.itemsCenter, layout.justifyCenter, gutters.padding_16]}>
        {/* Card container */}
        <View
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 12,
            padding: 20,
            backgroundColor: colors.purple100,
          }}
        >
          <View style={[layout.itemsCenter, gutters.marginBottom_16]}>
            <IconByVariant path="droplet"  width={55} height={55}  stroke={colors.purple500}/>
            <Text style={[fonts.size_32, { fontWeight: '800', color: '#FFFFFF', marginTop: 8 }]}>Rewarded</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <AuthTextInput
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (emailError) setEmailError(undefined);
                if (authError) setAuthError(undefined);
              }}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              onBlur={() => {
                const result = loginSchema.pick({ email: true }).safeParse({ email });
                if (!result.success) {
                  const err = result.error.flatten().fieldErrors.email?.[0];
                  setEmailError(err);
                } else {
                  setEmailError(undefined);
                }
              }}
              style={emailError ? { borderColor: colors.red500 } : undefined}
            />
            {emailError ? (
              <Text style={[fonts.size_12, { color: colors.red500, marginTop: -8, marginBottom: 8 }]}>{emailError}</Text>
            ) : undefined}
          </View>

          <View style={{ marginBottom: 8 }}>
            <AuthTextInput
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (passwordError) setPasswordError(undefined);
                if (authError) setAuthError(undefined);
              }}
              placeholder="Password"
              secureTextEntry
              style={passwordError ? { borderColor: colors.red500 } : undefined}
            />
            {passwordError ? (
              <Text style={[fonts.size_12, { color: colors.red500, marginTop: -8, marginBottom: 0 }]}>{passwordError}</Text>
            ) : undefined}

              {authError ? (
                  <Text style={[fonts.size_12, { color: colors.red500, marginBottom: 8 }]}>{authError}</Text>
              ) : undefined}
          </View>



          <PrimaryButton label={loading ? 'Logging in...' : 'Log in'} onPress={onLogin} disabled={loading || !isFormValid} style={{ marginBottom: 12 }} />

          {/* Google button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={{
              borderWidth: 1,
              borderColor:'#19222a',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <View style={{ marginRight: 8 }}>
              <IconByVariant path="google" width={20} height={20} />
            </View>
            <Text style={[fonts.size_16, { color: '#FFFFFF' }]}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Bottom links */}
          <View style={[layout.row, layout.justifyBetween, gutters.marginTop_16]}>
            <TouchableOpacity onPress={() => navigation.navigate(Paths.SignUp)}>
              <Text style={[fonts.size_12, { color: '#FFFFFF' }]}>Create account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[fonts.size_12, { color: '#FFFFFF' }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}

export default Login;
