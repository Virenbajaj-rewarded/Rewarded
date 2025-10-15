import { Alert, Linking, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import { useTheme } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths.ts';
import { styles } from './styles';
import { useCameraPermission } from 'react-native-vision-camera';

export default function ScanQRButton() {
  const { fonts } = useTheme();
  const navigation = useNavigation();
  const { hasPermission, requestPermission } = useCameraPermission();

  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={async () => {
        const granted = hasPermission || (await requestPermission());

        if (granted) {
          navigation.navigate(Paths.QR_SCANNER);
          return;
        }

        Alert.alert(
          'Camera access denied',
          'To scan QR codes, please allow access in the settings',
          [
            { text: 'Open Settings', onPress: Linking.openSettings },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }}
    >
      <MaterialIcons name={'qrcode-scan'} size={24} color={'#FFFFFF'} />
      <Text style={[fonts.size_24, { color: '#FFFFFF' }]}>Scan QR Code</Text>
    </TouchableOpacity>
  );
}
