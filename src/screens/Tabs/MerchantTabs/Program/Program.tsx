import { View } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths, Paths } from '@/navigation/paths.ts';
import { styles } from './Program.styles';
import { Typography } from '@/components';
import { ProgramTabNavigator } from '@/navigation/ProgramTabNavigator';
import { useFetchMerchantBalanceQuery } from '@/services/merchant/useMerchant';
import IconByVariant from '@/components/atoms/IconByVariant';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { useMerchant } from '@/services/merchant/useMerchant';

export default function Program({
  navigation,
}: MerchantTabCombinedScreenProps<MerchantTabPaths.PROGRAM>) {
  const { useFetchMerchantProfileQuery } = useMerchant();

  const { data: profile } = useFetchMerchantProfileQuery();

  const { data: merchantBalance } = useFetchMerchantBalanceQuery();

  const handleNavigateToQR = () => {
    if (!profile?.businessCode) return;
    navigation.navigate(Paths.QR_CODE, {
      id: profile.businessCode,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pointsIssuedContainer}>
          <Typography fontVariant="regular" fontSize={14} color="#D8E6FD">
            Points Issued
          </Typography>
          <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
            {merchantBalance?.points ?? 'No points yet'}
          </Typography>
        </View>

        <View style={styles.availableUSDContainerWrapper}>
          <View style={styles.availableUSDContainer}>
            <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
              Available USD
            </Typography>
            <View style={styles.availableUSDBalanceContainer}>
              <View style={styles.availableUSDBalanceText}>
                <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                  ${merchantBalance?.usd}
                </Typography>
              </View>
              <IconByVariant path="usd" width={24} height={24} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.availableUSDContainer}>
            <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
              Available USDS
            </Typography>
            <View style={styles.availableUSDBalanceContainer}>
              <View style={styles.availableUSDBalanceText}>
                <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                  ${merchantBalance?.usdc}
                </Typography>
              </View>
              <IconByVariant path="usd" width={24} height={24} color="#FFFFFF" />
            </View>
          </View>
        </View>
        <PrimaryButton
          label="My QR"
          onPress={handleNavigateToQR}
          icon={{ name: 'qr', color: '#FFFFFF', width: 16, height: 16 }}
        />
      </View>
      <View style={styles.tabsContainer}>
        <ProgramTabNavigator />
      </View>
    </View>
  );
}
