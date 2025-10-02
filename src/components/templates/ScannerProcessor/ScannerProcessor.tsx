import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

const { width, height } = Dimensions.get("window");
const SCAN_SIZE = Math.min(width * 0.7, 350);

export default function ScannerProcessor() {
  const navigation = useNavigation();
  const device = useCameraDevice("back");

  const { fonts, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const overlayTop = (height - SCAN_SIZE) / 2;
  const overlaySide = (width - SCAN_SIZE) / 2;

  const [torchOn, setTorchOn] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      console.log("Scanned codes", codes);
    },
  });

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={[fonts.size_32, { color: "#FFFFFF", marginBottom: 24 }]}>
          No camera found
        </Text>

        <TouchableOpacity
          style={[styles.goBackButton, { backgroundColor: colors.purple500 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[fonts.size_24, { color: "#FFFFFF" }]}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        torch={torchOn ? "on" : "off"}
        codeScanner={codeScanner}
      />

      <View style={[styles.header, { top: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Скануй QR</Text>
        <TouchableOpacity onPress={() => setTorchOn((p) => !p)}>
          <MaterialIcons
            name={torchOn ? "flash" : "flash-off"}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <View
        style={[styles.mask, { top: 0, left: 0, right: 0, height: overlayTop }]}
      />
      <View
        style={[
          styles.mask,
          { top: overlayTop, left: 0, width: overlaySide, height: SCAN_SIZE },
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            top: overlayTop,
            right: 0,
            width: overlaySide,
            height: SCAN_SIZE,
          },
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            bottom: 0,
            left: 0,
            right: 0,
            height: overlayTop,
          },
        ]}
      />

      <View
        style={[
          styles.scanArea,
          {
            top: overlayTop,
            left: overlaySide,
            width: SCAN_SIZE,
            height: SCAN_SIZE,
          },
        ]}
      >
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>
          Can’t scan the QR code?{"\n"}
          Try:{"\n"}- tapping on the screen to focus{"\n"}- adjusting the
          distance between the phone and the QR code{"\n"}- turning the
          flashlight on or off{"\n"}- restarting the app
        </Text>
      </View>
    </View>
  );
}
