import type { RootScreenProps } from '@/navigation/types';

import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';
import AuthTextInput from '@/components/auth/AuthTextInput';
import PrimaryButton from '@/components/auth/PrimaryButton';

function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { gutters, layout, fonts, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    // Placeholder logic: navigate to Example after a fake login
    navigation.reset({ index: 0, routes: [{ name: Paths.Example }] });
  };

  return (
    <SafeScreen>
      <View style={[layout.flex_1, layout.col, gutters.padding_16]}>
        <Text style={[fonts.size_24, gutters.marginBottom_16]}>Login</Text>

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

        <PrimaryButton label="Login" onPress={onLogin} style={{ marginBottom: 12 }} />

        <TouchableOpacity onPress={() => navigation.navigate(Paths.SignUp)}>
          <Text style={[fonts.size_12, { color: colors.purple500 }]}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

export default Login;
