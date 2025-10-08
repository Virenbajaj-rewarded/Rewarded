import { ActivityIndicator, Text, View } from "react-native";
import { MerchantDrawerCombinedScreenProps } from "@/navigation/types.ts";
import { MerchantDrawerPaths } from "@/navigation/paths.ts";
import ScanQRButton from "@/components/molecules/ScanQRButton";
import { useFetchMerchantBalanceQuery } from "@/hooks/domain/user/useUser.ts";
import IconByVariant from "@/components/atoms/IconByVariant";
import React from "react";
import { useTheme } from "@/theme";

export default function MyStore({}: MerchantDrawerCombinedScreenProps<MerchantDrawerPaths.MY_STORE>) {
  const { fonts } = useTheme();
  const {
    isRefetching,
    isLoading,
    data: balance,
  } = useFetchMerchantBalanceQuery();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: 16,
          marginVertical: 24,
          backgroundColor: "rgba(60,131,246,0.3)",
        }}
      >
        <Text style={[{ color: "#ffffff" }]}>Your Balance</Text>

        {isLoading || isRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text
              style={[fonts.size_16, { color: "#ffffff", fontWeight: "600" }]}
            >
              {balance?.balance || 0}
            </Text>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>
      <ScanQRButton />
    </View>
  );
}
