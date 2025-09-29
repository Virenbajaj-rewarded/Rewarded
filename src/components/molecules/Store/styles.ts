import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  storeContainer: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: "50%",
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemLabel: {
    flex: 1,
    color: "#FFFFFF",
  },
});
