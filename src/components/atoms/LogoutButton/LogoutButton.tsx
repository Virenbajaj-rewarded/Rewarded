import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import React, { useState } from "react";
import { useAuth } from "@/services/auth/AuthProvider.tsx";

export default function LogoutButton() {
  const { signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <View style={styles.container}>
      {loggingOut ? (
        <ActivityIndicator size="small" color="#3c83f6" />
      ) : (
        <TouchableOpacity
          hitSlop={{ right: 10, top: 10, bottom: 10, left: 10 }}
          onPress={() => {
            Alert.alert(
              "Are you sure you want to logout?",
              "",
              [
                {
                  text: "No",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: async () => {
                    setLoggingOut(true);
                    signOut().finally(() => setLoggingOut(false));
                  },
                },
              ],
              { cancelable: true },
            );
          }}
        >
          <MaterialIcons name="logout" size={24} color="#3c83f6" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
});
