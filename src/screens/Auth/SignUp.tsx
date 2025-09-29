import type { RootScreenProps } from "@/navigation/types";

import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import SafeScreen from "@/components/templates/SafeScreen";
import AuthTextInput from "@/components/auth/AuthTextInput";
import PrimaryButton from "@/components/auth/PrimaryButton";

function SignUp({ navigation }: RootScreenProps<Paths.SignUp>) {
  const { gutters, layout, fonts, colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSignUp = () => {
    // Placeholder logic: go to Login
    navigation.replace(Paths.Login);
  };

  return (
    <SafeScreen>
      <View style={[layout.flex_1, layout.col, gutters.padding_16]}>
        <Text style={[fonts.size_24, gutters.marginBottom_16]}>Sign Up</Text>

        <AuthTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <AuthTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        <AuthTextInput
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Confirm password"
          secureTextEntry
        />

        <PrimaryButton
          label="Create account"
          onPress={onSignUp}
          style={{ marginBottom: 12 }}
        />

        <TouchableOpacity onPress={() => navigation.navigate(Paths.Login)}>
          <Text style={[fonts.size_12, { color: colors.purple500 }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

export default SignUp;
