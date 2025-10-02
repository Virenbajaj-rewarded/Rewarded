import { RootScreenProps } from "@/navigation/types.ts";
import { Paths } from "@/navigation/paths.ts";
import ScannerProcessor from "@/components/templates/ScannerProcessor";

export default function QRScanner({}: RootScreenProps<Paths.QR_SCANNER>) {
  return <ScannerProcessor />;
}
