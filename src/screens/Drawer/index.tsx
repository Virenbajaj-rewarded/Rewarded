import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@/theme";
import { useAuth } from "@/services/auth/AuthProvider.tsx";

const Drawer = createDrawerNavigator();

function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export function MyWalletScreen() {
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

export function MyStoresScreen() {
  return <ScreenPlaceholder title="My Stores" />;
}

export function DiscoverEarnScreen() {
  return <ScreenPlaceholder title="Discover & Earn" />;
}

export function MySpendingScreen() {
  return <ScreenPlaceholder title="My Spending" />;
}

export const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="My Wallet"
        component={MyWalletScreen}
        options={{
          drawerActiveBackgroundColor: "#FFFFFF",
        }}
      />
      <Drawer.Screen name="My Stores" component={MyStoresScreen} />
      <Drawer.Screen name="Discover & Earn" component={DiscoverEarnScreen} />
      <Drawer.Screen name="My Spending" component={MySpendingScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600", color: "#FFFFFF" },
});

export default DrawerNavigator;
