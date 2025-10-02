import { RootScreenProps } from "@/navigation/types.ts";
import { Paths } from "@/navigation/paths.ts";
import ScannerProcessor from "@/components/templates/ScannerProcessor";

export default function QRScanner(props: RootScreenProps<Paths.QR_SCANNER>) {
  return <ScannerProcessor {...props} />;
}
