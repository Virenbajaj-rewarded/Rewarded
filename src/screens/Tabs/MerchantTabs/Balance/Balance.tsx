import { ActivityIndicator, View } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';
import { useFetchBalanceQuery } from '@/services/user/useUser';
import IconByVariant from '@/components/atoms/IconByVariant';
import { styles } from './Balance.styles';
import { Typography } from '@/components';

export default function Balance({}: MerchantTabCombinedScreenProps<MerchantTabPaths.BALANCE>) {
  const { isRefetching, isLoading, data: balance } = useFetchBalanceQuery();

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
          Your Balance
        </Typography>

        {isLoading || isRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View style={styles.balanceLabel}>
            <Typography fontVariant="bold" fontSize={16} color="#FFFFFF">
              {balance || 0}
            </Typography>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>
    </View>
  );
}
