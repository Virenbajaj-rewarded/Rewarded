import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
  },
  sliderText: {
    position: "absolute",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  swipeBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    position: "absolute",
    left: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 3,
  },
});
