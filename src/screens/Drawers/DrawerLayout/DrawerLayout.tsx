import { View } from "react-native";
import { PropsWithChildren } from "react";
import { styles } from "./styles.ts";

export default function DrawerLayout({ children }: PropsWithChildren) {
  return <View style={styles.screenWrapper}>{children}</View>;
}
