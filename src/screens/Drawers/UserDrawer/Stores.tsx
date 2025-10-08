import { UserDrawerCombinedScreenProps } from "@/navigation/types.ts";
import { UserDrawerPaths } from "@/navigation/paths.ts";
import MyStoreList from "@/components/templates/MyStoreList";

export default function Stores({}: UserDrawerCombinedScreenProps<UserDrawerPaths.STORES>) {
  return <MyStoreList />;
}
