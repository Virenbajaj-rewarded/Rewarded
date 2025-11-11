import { Alert, Linking, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths.ts';
import { styles } from './styles';
import { useCameraPermission } from 'react-native-vision-camera';
import IconByVariant from '@/components/atoms/IconByVariant';

export default function ScanQRButton() {
  const navigation = useNavigation();
  const { hasPermission, requestPermission } = useCameraPermission();

  const handleQRPress = async () => {
    const granted = hasPermission || (await requestPermission());

    if (granted) {
      navigation.navigate(Paths.QR_SCANNER);
      return;
    }

    Alert.alert('Camera access denied', 'To scan QR codes, please allow access in the settings', [
      { text: 'Open Settings', onPress: Linking.openSettings },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleQRPress}>
      <IconByVariant path="qr" width={20} height={20} />
    </TouchableOpacity>
  );
}
