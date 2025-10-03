import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerWrapper: {
    padding: 16,
    gap: 11,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5cc6b8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    minWidth: 60,
  },
  commentBox: {
    marginTop: "auto",
    paddingTop: 12,
    marginBottom: 12,
  },
  commentInput: {
    fontSize: 16,
    color: "#FFFFFF",
    maxHeight: 100,
  },
  divider: {
    height: 1,
    backgroundColor: "#3c83f6",
  },
  confirmBtnWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "auto",
    marginBottom: 18,
    gap: 4,
    padding: 8,
    borderRadius: 12,
    borderColor: "#3c83f6",
    backgroundColor: "rgba(60,131,246,0.3)",
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  balanceLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#ffffff",
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: "none",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "auto",
    gap: 16,
    marginTop: 24,
  },
  optionItem: {
    padding: 11,
    borderRadius: 8,
    width: 120,
    backgroundColor: "rgba(60,131,204,0.3)",
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: "center",
    color: "#ffffff",
  },
});
