import { View } from 'react-native';
import { Typography } from '@/components';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { QrCodeSvg } from 'react-native-qr-svg';
import { QR_CODE } from '@/types';
import { styles } from './QRCode.styles';

export default function QRCode({ route }: RootScreenProps<Paths.QR_CODE>) {
  const { id } = route.params;
  return (
    <View style={styles.container}>
      <QrCodeSvg
        value={JSON.stringify({
          value: id || '',
          type: 'store_profile',
        } satisfies QR_CODE)}
        frameSize={220}
        backgroundColor={'transparent'}
        dotColor={'#ffffff'}
        style={styles.qrCode}
      />
      <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
        {id}
      </Typography>
    </View>
  );
}
