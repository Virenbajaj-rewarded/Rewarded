import type { RootScreenProps } from '@/navigation/types';

import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Paths } from '@/navigation/paths';

import SafeScreen from '@/components/templates/SafeScreen';
import AuthTextInput from '@/components/auth/AuthTextInput/AuthTextInput';
import PrimaryButton from '@/components/auth/PrimaryButton/PrimaryButton';
import { styles } from './Signup.styles';

function SignUp({ navigation }: RootScreenProps<Paths.SignUp>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const onSignUp = () => {
    // Placeholder logic: go to Login
    navigation.replace(Paths.Login);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Sign Up</Text>

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

        <PrimaryButton label="Create account" onPress={onSignUp} style={{ marginBottom: 12 }} />

        <TouchableOpacity onPress={() => navigation.navigate(Paths.Login)}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

export default SignUp;
