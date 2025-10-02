import { Text, View } from "react-native";
import { UserDrawerCombinedScreenProps } from "@/navigation/types.ts";
import { UserDrawerPaths } from "@/navigation/paths.ts";
import React from "react";
import { useAuth } from "@/services/auth/AuthProvider.tsx";
import { QrCodeSvg } from "react-native-qr-svg";
import { useTheme } from "@/theme";
import ScanQRButton from "@/components/molecules/ScanQRButton";
import { QR_CODE } from "@/types";

export default function Wallet({}: UserDrawerCombinedScreenProps<UserDrawerPaths.MY_WALLET>) {
  const { user } = useAuth();
  const { fonts } = useTheme();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={[
          fonts.size_32,
          { color: "#ffffff", textAlign: "center", marginBottom: 24 },
        ]}
      >
        My Profile QR Code
      </Text>
      <QrCodeSvg
        value={JSON.stringify({
          value: user?.id || "",
          type: "customer_profile",
        } satisfies QR_CODE)}
        frameSize={200}
        backgroundColor={"transparent"}
        dotColor={"#ffffff"}
        style={{
          marginHorizontal: "auto",
        }}
      />
      <ScanQRButton />
    </View>
  );
}
