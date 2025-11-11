import { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  Code,
  CodeScannerFrame,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import { styles } from './ScannerProcessor.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ACCESSIBLE_QR_TYPES, QR_CODE } from '@/types';
import { safeJsonParse } from '@/utils/helpers.ts';
import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = Math.min(width * 0.7, 350);

export default function ScannerProcessor({ navigation }: RootScreenProps<Paths.QR_SCANNER>) {
  const device = useCameraDevice('back');

  const insets = useSafeAreaInsets();

  const overlayTop = (height - SCAN_SIZE) / 2;
  const overlaySide = (width - SCAN_SIZE) / 2;

  const [torchOn, setTorchOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const lastScannedValue = useRef<string | null>(null);

  useFocusEffect(() => {
    lastScannedValue.current = null;
  });

  const format = useCameraFormat(device, [{ videoResolution: { width: 720, height: 1280 } }]);

  const regionOfInterest = useMemo(() => {
    if (!format) return undefined;

    const camW = format.videoWidth;
    const camH = format.videoHeight;

    const scale = Math.max(width / camW, height / camH);
    const scaledW = camW * scale;
    const scaledH = camH * scale;

    const offsetX = (scaledW - width) / 2;
    const offsetY = (scaledH - height) / 2;

    const roiX = (overlaySide + offsetX) / scaledW;
    const roiY = (overlayTop + offsetY) / scaledH;
    const roiWidth = SCAN_SIZE / scaledW;
    const roiHeight = SCAN_SIZE / scaledH;

    return { x: roiX, y: roiY, width: roiWidth, height: roiHeight };
  }, [format, overlaySide, overlayTop]);

  const isCodeInsideROI = (code: Code, frame: CodeScannerFrame) => {
    if (!code?.frame || !frame || !regionOfInterest) {
      return false;
    }

    const { x: codeX, y: codeY, width: codeW, height: codeH } = code.frame;

    const centerX = codeY + codeW / 2;
    const centerY = codeX + codeH / 2;
    const normalizedLeft = 1 - centerX / frame.height;
    const normalizedTop = centerY / frame.width;
    return (
      normalizedLeft >= regionOfInterest.x &&
      normalizedLeft <= regionOfInterest.x + regionOfInterest.width &&
      normalizedTop >= regionOfInterest.y &&
      normalizedTop <= regionOfInterest.y + regionOfInterest.height
    );
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes, frame) => {
      const qr = codes[0];
      let isInside = true;
      if (Platform.OS !== 'ios') isInside = isCodeInsideROI(qr, frame); // On IOS, we use regionOfInterest

      if (!isInside || !qr.value || qr.value === lastScannedValue.current) {
        return;
      }

      lastScannedValue.current = qr.value;

      const parsedQR = safeJsonParse(qr.value) as unknown as QR_CODE;

      if (!parsedQR || !parsedQR.type || !ACCESSIBLE_QR_TYPES.includes(parsedQR.type)) {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not supported. Please try a different one.'
        );
        return;
      }

      processQR(parsedQR);
    },
    regionOfInterest, // Note: works only on IOS
  });

  async function processQR(qrCode: QR_CODE) {
    try {
      setLoading(true);
      switch (qrCode.type) {
        case 'customer_profile':
          navigation.replace(Paths.MERCHANT_QR_PAYMENT, {
            consumerId: qrCode.value,
          });
          break;
        case 'store_profile':
          navigation.replace(Paths.SCAN_STORE, {
            businessCode: qrCode.value,
          });
          break;
        default:
          throw new Error('Unknown type');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      Alert.alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const onGoBack = () => {
    navigation.goBack();
  };

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={styles.noCameraText}>No camera found</Text>

        <TouchableOpacity style={styles.goBackButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>Back</Text>
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
        torch={torchOn ? 'on' : 'off'}
        codeScanner={codeScanner}
        format={format}
      />

      <View style={[styles.header, { top: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR</Text>

        {device.hasTorch ? (
          <TouchableOpacity onPress={() => setTorchOn(p => !p)}>
            <MaterialIcons name={torchOn ? 'flash' : 'flash-off'} size={28} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      <View style={[styles.mask, { top: 0, left: 0, right: 0, height: overlayTop }]} />
      <View
        style={[styles.mask, { top: overlayTop, left: 0, width: overlaySide, height: SCAN_SIZE }]}
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

      {loading && (
        <View style={[styles.loadingContainer, { top: overlayTop + SCAN_SIZE + 40 }]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.hint}>
          Can’t scan the QR code?{'\n'}
          Try:{'\n'}- tapping on the screen to focus{'\n'}- adjusting the distance between the phone
          and the QR code{'\n'}- turning the flashlight on or off{'\n'}- restarting the app
        </Text>
      </View>
    </View>
  );
}
