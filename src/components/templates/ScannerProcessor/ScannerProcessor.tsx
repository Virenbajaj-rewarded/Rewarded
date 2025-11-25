import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import { styles } from './ScannerProcessor.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ACCESSIBLE_QR_TYPES, QR_CODE } from '@/types';
import { safeJsonParse } from '@/utils/helpers.ts';
import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useUser } from '@/services/user/useUser';
import { ERole } from '@/enums';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { Typography } from '@/components';
import IconByVariant from '@/components/atoms/IconByVariant';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = Math.min(width * 0.7, 350);

export default function ScannerProcessor({ navigation }: RootScreenProps<Paths.QR_SCANNER>) {
  const device = useCameraDevice('back');

  const insets = useSafeAreaInsets();

  const overlayTop = (height - SCAN_SIZE) / 2;
  const overlaySide = (width - SCAN_SIZE) / 2;

  const { useFetchProfileQuery } = useUser();
  const { data: profile } = useFetchProfileQuery();

  const [torchOn, setTorchOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleMismatchError, setRoleMismatchError] = useState(false);

  // Track last processed QR code to prevent duplicate processing
  const lastProcessedQRRef = useRef<string | null>(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (roleMismatchError || loading) {
        return;
      }

      const qr = codes && codes.length > 0 ? codes[0] : null;
      if (!qr?.value) {
        return;
      }

      // Prevent processing the same QR code multiple times
      if (lastProcessedQRRef.current === qr.value) {
        return;
      }

      const parsedQR = safeJsonParse(qr.value) as unknown as QR_CODE;

      if (!parsedQR || !parsedQR.type || !ACCESSIBLE_QR_TYPES.includes(parsedQR.type)) {
        // Mark as processed to prevent multiple alerts
        lastProcessedQRRef.current = qr.value;
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not supported. Please try a different one.'
        );
        return;
      }

      // Mark this QR code as processed and process it
      lastProcessedQRRef.current = qr.value;
      processQR(parsedQR);
    },
  });

  async function processQR(qrCode: QR_CODE) {
    try {
      setLoading(true);

      if (profile?.role && qrCode.role && profile.role !== qrCode.role) {
        setRoleMismatchError(true);
        setLoading(false);
        return;
      }

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

  const handleTryAgain = () => {
    setRoleMismatchError(false);
    // Reset ref to allow scanning again
    lastProcessedQRRef.current = null;
  };

  const getErrorMessage = () => {
    if (profile?.role === ERole.USER) {
      return 'It looks like you scanned another user’s QR code, not a store’s. Please try scanning a store QR code instead.';
    }

    if (profile?.role === ERole.MERCHANT) {
      return 'It looks like you scanned another merchant’s QR code, not a user’s. Please try scanning a user QR code instead.';
    }
    return 'It looks like you scanned invalid QR code. Please try scanning another QR code instead.';
  };

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

  if (roleMismatchError) {
    return (
      <View style={styles.errorContainer}>
        <IconByVariant path="warning-triangle" width={80} height={80} />
        <Typography fontVariant="bold" fontSize={24} color="#FFFFFF" style={styles.errorTitle}>
          Wrong QR Code
        </Typography>
        <Typography fontVariant="regular" fontSize={14} color="#FFFFFF" textAlign="center">
          {getErrorMessage()}
        </Typography>
        <PrimaryButton label="Try Again" onPress={handleTryAgain} style={styles.tryAgainButton} />
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
          Can&apos;t scan the QR code?{'\n'}
          Try:{'\n'}- tapping on the screen to focus{'\n'}- adjusting the distance between the phone
          and the QR code{'\n'}- turning the flashlight on or off{'\n'}- restarting the app
        </Text>
      </View>
    </View>
  );
}
