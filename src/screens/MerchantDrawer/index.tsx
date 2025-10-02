import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  MerchantDrawerStackParamList,
  RootScreenProps,
} from "@/navigation/types.ts";
import { MerchantDrawerPaths, Paths } from "@/navigation/paths.ts";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/services/auth/AuthProvider.tsx";
import Layout from "@/screens/Drawer/Layout.tsx";
import MyStore from "@/screens/MerchantDrawer/MyStore.tsx";

//TODO Refactor

const MerchantDrawer = createDrawerNavigator<MerchantDrawerStackParamList>();

export default function MerchantDrawerNavigator({
  navigation,
}: RootScreenProps<Paths.MerchantDrawer>) {
  const { signOut } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <MerchantDrawer.Navigator
      screenLayout={Layout}
      //FIXME Reuse it in another Drawer
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        swipeEnabled: true,
        drawerInactiveTintColor: "#ffffff",
        headerTitleStyle: {
          color: "#ffffff",
        },
        headerRight: () => {
          return (
            <View style={{ marginRight: 10 }}>
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
        },
      }}
    >
      <MerchantDrawer.Screen
        name={MerchantDrawerPaths.MY_STORE}
        component={MyStore}
        options={{
          drawerLabel: "My Store",
          headerTitle: "My Store",
        }}
      />
    </MerchantDrawer.Navigator>
  );
}
