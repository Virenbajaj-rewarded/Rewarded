import { DrawerCombinedScreenProps } from "@/navigation/types.ts";
import { DrawerPaths } from "@/navigation/paths.ts";
import MyStoreList from "@/components/templates/MyStoreList";

export default function Stores({}: DrawerCombinedScreenProps<DrawerPaths.STORES>) {
  return <MyStoreList />;
}
