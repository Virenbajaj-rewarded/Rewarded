import SafeScreen from "@/components/templates/SafeScreen";
import { RootScreenProps } from "@/navigation/types.ts";
import { Paths } from "@/navigation/paths.ts";

export default function MerchantQRPayment({}: RootScreenProps<Paths.MERCHANT_QR_PAYMENT>) {
  return <SafeScreen></SafeScreen>;
}
