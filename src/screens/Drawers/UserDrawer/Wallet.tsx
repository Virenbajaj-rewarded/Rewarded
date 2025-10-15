import { ActivityIndicator, Text, View } from 'react-native';
import { UserDrawerCombinedScreenProps } from '@/navigation/types.ts';
import { UserDrawerPaths } from '@/navigation/paths.ts';
import { useAuth } from '@/services/auth/AuthProvider.tsx';
import { QrCodeSvg } from 'react-native-qr-svg';
import { useTheme } from '@/theme';
import { QR_CODE } from '@/types';
import { useFetchCustomerBalanceQuery } from '@/services/user/useUser';
import IconByVariant from '@/components/atoms/IconByVariant';

export default function Wallet({}: UserDrawerCombinedScreenProps<UserDrawerPaths.MY_WALLET>) {
  const { user } = useAuth();
  const { fonts } = useTheme();

  const { isLoading, isRefetching, data: balances } = useFetchCustomerBalanceQuery();

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 24,
      }}
    >
      <Text
        style={[
          fonts.size_32,
          {
            color: '#ffffff',
            fontWeight: '600',
            marginBottom: 24,
          },
        ]}
      >
        Wallet Overview
      </Text>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 16,
          backgroundColor: 'rgba(60,131,246,0.3)',
        }}
      >
        <Text style={[fonts.size_24, { color: '#ffffff' }]}>Earned Points</Text>
        {isLoading || isRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={[fonts.size_16, { color: '#ffffff', fontWeight: '600' }]}>
              {balances?.find(balance => balance.type === 'FREE')?.balance || 0}
            </Text>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 16,
          marginBottom: 'auto',
          backgroundColor: 'rgba(60,131,246,0.3)',
          marginTop: 16,
        }}
      >
        <Text style={[fonts.size_24, { color: '#ffffff' }]}>Purchased Points</Text>
        {isLoading || isRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={[fonts.size_16, { color: '#ffffff', fontWeight: '600' }]}>
              {balances?.find(balance => balance.type === 'PAID')?.balance || 0}
            </Text>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>

      <Text style={[fonts.size_24, { color: '#ffffff', textAlign: 'center', marginBottom: 24 }]}>
        My Profile QR Code
      </Text>
      <QrCodeSvg
        value={JSON.stringify({
          value: user?.id || '',
          type: 'customer_profile',
        } satisfies QR_CODE)}
        frameSize={200}
        backgroundColor={'transparent'}
        dotColor={'#ffffff'}
        style={{
          marginHorizontal: 'auto',
        }}
      />
    </View>
  );
}
