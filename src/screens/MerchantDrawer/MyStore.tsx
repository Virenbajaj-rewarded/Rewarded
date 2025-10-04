import { View } from "react-native";
import { MerchantDrawerCombinedScreenProps } from "@/navigation/types.ts";
import { MerchantDrawerPaths } from "@/navigation/paths.ts";
import ScanQRButton from "@/components/molecules/ScanQRButton";

export default function MyStore({}: MerchantDrawerCombinedScreenProps<MerchantDrawerPaths.MY_STORE>) {
  return (
    <View style={{ flex: 1 }}>
      <ScanQRButton />
    </View>
  );
}
