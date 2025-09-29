import { View } from "react-native";
import { PropsWithChildren } from "react";
import { styles } from "./styles";

export default function Layout({ children }: PropsWithChildren) {
  return <View style={styles.screenWrapper}>{children}</View>;
}
