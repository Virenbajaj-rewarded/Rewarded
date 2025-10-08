import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { styles } from "./styles";
import IconByVariant from "@/components/atoms/IconByVariant";
import { useTheme } from "@/theme";
import { useAuth } from "@/services/auth/AuthProvider.tsx";
import { useState } from "react";

export default function GoogleButton(
  props: Omit<TouchableOpacityProps, "style">,
) {
  const { fonts } = useTheme();
  const { signInWithGoogle } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignInWithGoogle = async () => {
    try {
      setGoogleLoading(true);

      await signInWithGoogle();
    } catch (e) {
      const error = e as Error;
      Alert.alert(
        error?.message || "Error",
        "Please try again later",
        [{ text: "OK" }],
        {
          cancelable: true,
        },
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleSignInWithGoogle}
      disabled={props?.disabled || googleLoading}
    >
      <IconByVariant path="google" width={20} height={20} />

      <Text style={[fonts.size_16, { color: "#FFFFFF" }]}>
        Continue with Google
      </Text>
      {googleLoading && <ActivityIndicator />}
    </TouchableOpacity>
  );
}
