import { ActivityIndicator, View } from 'react-native';
import { UserTabCombinedScreenProps } from '@/navigation/types.ts';
import { UserTabPaths } from '@/navigation/paths.ts';
import { useAuth } from '@/services/auth/useAuth';
import { QrCodeSvg } from 'react-native-qr-svg';
import { QR_CODE } from '@/types';
import { useFetchCustomerBalanceQuery } from '@/services/user/useUser';
import IconByVariant from '@/components/atoms/IconByVariant';
import { Typography } from '@/components';
import { styles } from './Wallet.styles';

export default function Wallet({}: UserTabCombinedScreenProps<UserTabPaths.WALLET>) {
  const { useFetchProfileQuery } = useAuth();

  const { data: user } = useFetchProfileQuery();

  const { isLoading, isRefetching, data: balances } = useFetchCustomerBalanceQuery();

  return (
    <View style={styles.container}>
      <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
        Wallet Overview
      </Typography>
      <View style={styles.earnedPointsContainer}>
        <Typography fontVariant="regular" fontSize={24} color="#FFFFFF">
          Earned Points
        </Typography>
        {isLoading || isRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View style={styles.balanceContainer}>
            <Typography fontVariant="bold" fontSize={16} color="#FFFFFF">
              {balances?.balance || 0}
            </Typography>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>

      <View style={styles.purchasedPointsContainer}>
        <Typography fontVariant="regular" fontSize={24} color="#FFFFFF">
          Purchased Points
        </Typography>
        {isLoading || isRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View style={styles.balanceContainer}>
            <Typography fontVariant="bold" fontSize={16} color="#FFFFFF">
              {balances?.balance || 0}
            </Typography>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>

      <Typography fontVariant="regular" fontSize={24} color="#FFFFFF" textAlign="center">
        My Profile QR Code
      </Typography>
      <QrCodeSvg
        value={JSON.stringify({
          value: user?.id || '',
          type: 'customer_profile',
        } satisfies QR_CODE)}
        frameSize={200}
        backgroundColor={'transparent'}
        dotColor={'#ffffff'}
        style={styles.qrCode}
      />
    </View>
  );
}
