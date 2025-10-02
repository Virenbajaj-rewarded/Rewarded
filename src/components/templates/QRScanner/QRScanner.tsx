import React, { useState, useCallback } from "react";
import {
  Alert,
  View,
  ActivityIndicator,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { useTheme } from "@/theme";

export default function QRScanner() {
  const { fonts, colors } = useTheme();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<any>(null);

  console.log(qrData);
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      console.log("Call", codes);
      if (codes.length > 0 && !loading) {
        try {
          const parsed = JSON.parse(codes[0].value ?? "{}");
          if (!parsed.type) {
            throw new Error("Invalid QR payload");
          }

          setScanning(false);
          setLoading(true);
          setQrData(parsed);

          switch (parsed.type) {
            case "openScreenA":
              console.log("Navigate to Screen A");
              break;
            case "openScreenB":
              console.log("Navigate to Screen B");
              break;
            default:
              console.log("Unknown type", parsed.type);
              break;
          }

          // Приклад — через 2 секунди знімаємо лоудер
          setTimeout(() => setLoading(false), 2000);
        } catch (e) {
          // Alert.alert("Помилка", "Невалідний QR-код");
          setScanning(false);
        }
      }
    },
  });

  const handleStartScan = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Доступ до камери заборонено",
          "Щоб сканувати QR-коди, дозвольте доступ у налаштуваннях",
          [
            { text: "Відкрити налаштування", onPress: Linking.openSettings },
            { text: "Скасувати", style: "cancel" },
          ],
        );
        return;
      }
    }
    setScanning(true);
  }, [hasPermission, requestPermission]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (scanning && device) {
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={scanning}
        codeScanner={codeScanner}
      />
    );
  }

  return (
    <View style={styles.center}>
      <TouchableOpacity
        onPress={handleStartScan}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 8,
          backgroundColor: colors.purple50,
          padding: 8,
          gap: 8,
        }}
      >
        <MaterialIcons name={"qrcode-scan"} size={24} />
        <Text style={[fonts.size_24]}>Scan QR Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
