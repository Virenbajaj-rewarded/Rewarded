import { Paths } from "@/navigation/paths.ts";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { RootScreenProps } from "@/navigation/types.ts";
import React from "react";
import { useTheme } from "@/theme";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";

export default function Store({ route }: RootScreenProps<Paths.Store>) {
  const { storeId, store } = route.params;

  const { fonts, colors } = useTheme();

  if (!store) throw new Error(`Store with id ${storeId} not found`);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 45 }}>
      <View
        style={{
          position: "absolute",
          top: -30, // піднімає логотип на половину (регулюй під свій розмір)
          zIndex: 2,
          alignSelf: "center",
        }}
      >
        <Image
          source={{ uri: store.logoUrl }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.purple100,
          borderWidth: 1,
          borderColor: colors.purple50,
          borderRadius: 8,
          padding: 22,
        }}
      >
        <Text
          style={[
            fonts.size_32,
            { color: "#FFFFFF", textAlign: "center", paddingTop: 60 },
          ]}
        >
          {store.businessName}
        </Text>
        <View style={{ gap: 11, marginTop: 18 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="card-account-mail" size={18} color="#ffffff" />
            <Text style={[fonts.size_16, { color: "#FFFFFF" }]}>
              {store.businessEmail}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="phone" size={18} color="#ffffff" />
            <Text style={[fonts.size_16, { color: "#FFFFFF" }]}>
              {store.businessPhoneNumber}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons
              name="map-marker-outline"
              size={18}
              color="#ffffff"
            />
            <Text style={[fonts.size_16, { color: "#FFFFFF", flexShrink: 1 }]}>
              {store.businessAddress}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.purple500,
            borderRadius: 8,
            padding: 8,
            marginTop: 24,
          }}
          onPress={() => {
            console.log("pay");
          }}
        >
          <Text
            style={[fonts.size_24, { color: "#FFFFFF", textAlign: "center" }]}
          >
            Pay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
