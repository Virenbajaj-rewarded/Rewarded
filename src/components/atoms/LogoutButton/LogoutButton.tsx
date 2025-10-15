import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import { useState } from 'react';
import { useAuth } from '@/services/auth/AuthProvider.tsx';
import { styles } from './LogoutButton.styles';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    signOut().finally(() => setLoading(false));
  };

  const handleLogout = async () => {
    Alert.alert(
      'Are you sure you want to logout?',
      '',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#3c83f6" />
      ) : (
        <TouchableOpacity
          hitSlop={{ right: 10, top: 10, bottom: 10, left: 10 }}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#3c83f6" />
        </TouchableOpacity>
      )}
    </View>
  );
}
