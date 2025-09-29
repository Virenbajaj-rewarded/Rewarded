import type { RootScreenProps } from "@/navigation/types";

import { useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { z } from "zod";

import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import IconByVariant from "@/components/atoms/IconByVariant";
import SafeScreen from "@/components/templates/SafeScreen";
import AuthTextInput from "@/components/auth/AuthTextInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import { useAuth } from "@/services/auth/AuthProvider.tsx";
import { styles } from "./styles.ts";
import GoogleButton from "@/components/molecules/GoogleButton";

const loginSchema = z.object({
  email: z.email().min(1, { error: "Email is required" }),
  password: z.string().min(1, { error: "Password is required" }),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { gutters, layout, fonts, colors } = useTheme();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState<LoginForm["email"]>("");
  const [password, setPassword] = useState<LoginForm["password"]>("");
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
    } catch (e) {
      const error = e as Error;
      setAuthError(error?.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={[
            layout.flex_1,
            layout.itemsCenter,
            layout.justifyCenter,
            gutters.padding_16,
          ]}
        >
          <View style={[styles.card, { backgroundColor: colors.purple100 }]}>
            <View style={[layout.itemsCenter, gutters.marginBottom_16]}>
              <IconByVariant
                path="droplet"
                width={55}
                height={55}
                stroke={colors.purple500}
              />
              <Text
                style={[
                  fonts.size_32,
                  { fontWeight: "800", color: "#FFFFFF", marginTop: 8 },
                ]}
              >
                Rewarded
              </Text>
            </View>

            <View style={styles.inputWrapper}>
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
                  const result = loginSchema
                    .pick({ email: true })
                    .safeParse({ email });
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
                <Text
                  style={[
                    fonts.size_12,
                    { color: colors.red500, marginTop: -8, marginBottom: 8 },
                  ]}
                >
                  {emailError}
                </Text>
              ) : undefined}
            </View>

            <View style={styles.inputWrapper}>
              <AuthTextInput
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (passwordError) setPasswordError(undefined);
                  if (authError) setAuthError(undefined);
                }}
                placeholder="Password"
                secureTextEntry
                style={
                  passwordError ? { borderColor: colors.red500 } : undefined
                }
              />
              {passwordError ? (
                <Text
                  style={[
                    fonts.size_12,
                    { color: colors.red500, marginTop: -8, marginBottom: 0 },
                  ]}
                >
                  {passwordError}
                </Text>
              ) : undefined}

              {authError ? (
                <Text
                  style={[
                    fonts.size_12,
                    { color: colors.red500, marginBottom: 8 },
                  ]}
                >
                  {authError}
                </Text>
              ) : undefined}
            </View>

            <PrimaryButton
              label={loading ? "Logging in..." : "Log in"}
              onPress={onLogin}
              disabled={loading || !isFormValid}
              style={{ marginBottom: 12 }}
            />

            <GoogleButton disabled={loading} />

            <View
              style={[layout.row, layout.justifyBetween, gutters.marginTop_16]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate(Paths.SignUp)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[fonts.size_12, { color: "#FFFFFF" }]}>
                  Create account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
}

export default Login;
