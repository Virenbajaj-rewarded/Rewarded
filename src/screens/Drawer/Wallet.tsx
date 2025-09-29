import { Alert, Text, TouchableOpacity, View } from "react-native";
import { DrawerCombinedScreenProps } from "@/navigation/types.ts";
import { DrawerPaths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";
import { useAuth } from "@/services/auth/AuthProvider.tsx";
import React from "react";

export default function Wallet({}: DrawerCombinedScreenProps<DrawerPaths.MY_WALLET>) {
  const { colors } = useTheme();
  const { signOut } = useAuth();

  return (
    <View style={{ marginTop: 75 }}>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: colors.purple500,
          marginHorizontal: 20,
          borderRadius: 5,
        }}
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
                onPress: () => {
                  signOut(); // <-- call your logout function here
                },
              },
            ],
            { cancelable: true },
          );
        }}
      >
        <Text style={{ color: "#ffffff" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
