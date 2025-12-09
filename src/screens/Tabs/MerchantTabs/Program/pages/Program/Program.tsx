import { View } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths, Paths } from '@/navigation/paths.ts';
import { styles } from './Program.styles';
import { Typography } from '@/components';
import { useFetchBalanceQuery } from '@/services/user/useUser';
import IconByVariant from '@/components/atoms/IconByVariant';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { useMerchant } from '@/services/merchant/useMerchant';
import { useCallback, useMemo, useState } from 'react';
import { EProgramStatusDisplayNames } from '@/enums';
import ProgramList from '@/screens/Tabs/MerchantTabs/Program/components/ProgramList/ProgramList';

export default function Program({
  navigation,
}: MerchantTabCombinedScreenProps<MerchantTabPaths.PROGRAM>) {
  const { useFetchMerchantProfileQuery } = useMerchant();
  const { data: profile } = useFetchMerchantProfileQuery();
  const { data: merchantBalance } = useFetchBalanceQuery();

  const [activeTab, setActiveTab] = useState<EProgramStatusDisplayNames>(
    EProgramStatusDisplayNames.ACTIVE
  );

  const handleNavigateToQR = useCallback(() => {
    if (!profile?.businessCode) return;
    navigation.navigate(Paths.QR_CODE, {
      id: profile.businessCode,
    });
  }, [profile?.businessCode, navigation]);

  const headerComponent = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.pointsIssuedContainer}>
          <Typography fontVariant="regular" fontSize={14} color="#D8E6FD">
            Points Issued
          </Typography>
          <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
            {merchantBalance ?? 'No points yet'}
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
                  ${merchantBalance}
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
                  ${merchantBalance}
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
    ),
    [merchantBalance, handleNavigateToQR]
  );

  return (
    <View style={styles.container}>
      <ProgramList
        activeTab={activeTab}
        onTabChange={setActiveTab}
        headerComponent={headerComponent}
      />
    </View>
  );
}
