import type { RootScreenProps } from '@/navigation/types';

import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Paths } from '@/navigation/paths';

import SafeScreen from '@/components/templates/SafeScreen';
import { TextField, PrimaryButton } from '@/components';
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

        <TextField
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        <TextField
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
