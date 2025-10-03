import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import SafeScreen from "@/components/templates/SafeScreen";
import { RootScreenProps } from "@/navigation/types.ts";
import { Paths } from "@/navigation/paths.ts";
import IconByVariant from "@/components/atoms/IconByVariant";

export default function MerchantQRPayment({
  navigation,
}: RootScreenProps<Paths.MERCHANT_QR_PAYMENT>) {
  const consumer = {
    id: "123",
    name: "Юля Міончинська",
  };

  const balance = 887.88;

  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [warning, setWarning] = useState(false);

  const amountInputRef = useRef<TextInput>(null);
  const commentInputRef = useRef<TextInput>(null);

  const translateY = useSharedValue(50);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.exp),
    });

    const timer = setTimeout(() => {
      amountInputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: withTiming(translateY.value === 0 ? 1 : 0, { duration: 300 }),
  }));

  const handleConfirm = () => {
    console.log("Confirm pressed", { amount, comment });
    // тут далі буде логіка API
  };

  const handleInputChange = (text: string) => {
    let formatted = text.replace(",", ".");

    formatted = formatted.replace(/[^0-9.]/g, "");

    const firstDotIndex = formatted.indexOf(".");
    if (firstDotIndex !== -1) {
      formatted =
        formatted.slice(0, firstDotIndex + 1) +
        formatted.slice(firstDotIndex + 1).replace(/\./g, "");
    }

    let [intPart, decPart] = formatted.split(".");

    if (intPart) {
      intPart = intPart.slice(0, 8);
    }

    if (intPart && intPart.length > 1 && intPart.startsWith("0") && !decPart) {
      intPart = String(parseInt(intPart, 10));
    }

    if (decPart !== undefined) {
      decPart = decPart.slice(0, 2);
      formatted = decPart.length > 0 ? `${intPart}.${decPart}` : intPart + ".";
    } else {
      formatted = intPart ?? "";
    }

    if (formatted === ".") {
      formatted = "0.";
    }

    if (formatted === "0") {
      formatted = "";
    }

    setAmount(formatted);

    const numericValue = parseFloat(formatted);
    if (!isNaN(numericValue) && numericValue > balance) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
          >
            <MaterialIcons name={"arrow-left"} size={24} color={"#ffffff"} />
          </TouchableOpacity>

          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>ЮМ</Text>
            </View>
            <Text style={styles.userName}>{consumer.name}</Text>
          </View>
        </View>
        <Animated.View style={[styles.content, animatedStyle]}>
          <View
            style={[
              styles.balanceContainer,
              warning && {
                borderColor: "#ff0000",
                backgroundColor: "rgba(255,0,0,0.2)",
              },
            ]}
          >
            <MaterialIcons name={"wallet"} size={16} color={"#ffffff"} />
            <View style={styles.balanceLabelWrapper}>
              <Text style={styles.balanceLabel}>{balance}</Text>
              <IconByVariant path="coins" width={16} height={16} />
            </View>
          </View>
          <View style={styles.amountWrapper}>
            <TextInput
              ref={amountInputRef}
              style={styles.amountInput}
              keyboardType="numeric"
              value={amount}
              placeholderTextColor={"#FFFFFF"}
              allowFontScaling={false}
              onChangeText={handleInputChange}
              placeholder={"0"}
              caretHidden={true}
            />
            <IconByVariant path="coins" width={40} height={40} />
          </View>
        </Animated.View>

        <View style={styles.divider} />
        <View style={styles.confirmBtnWrapper}>
          <View style={styles.commentBox}>
            <TextInput
              ref={commentInputRef}
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Comment..."
              placeholderTextColor="#999"
              returnKeyType="done"
              multiline={true}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !amount ? styles.confirmButtonDisabled : null,
            ]}
            onPress={handleConfirm}
            disabled={!amount}
          >
            <Text style={styles.confirmText}>Надіслати</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
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
  },
  confirmButton: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ddd",
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
});
