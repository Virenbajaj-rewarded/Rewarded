import { Paths } from '@/navigation/paths.ts';
import { Image, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import type { RootScreenProps } from '@/navigation/types.ts';
import Typography from '@/components/Typography/Typography';
import IconByVariant from '@/components/atoms/IconByVariant';
import { QrCodeSvg } from 'react-native-qr-svg';
import { QR_CODE } from '@/types';
import { useScanStore } from './useScanStore';
import { styles } from './ScanStore.styles';
import SafeScreen from '@/components/templates/SafeScreen';
import { useShortAddress } from '@/hooks';
import { EIndustryDisplayNames, EProgramStrategy, ERole } from '@/enums';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';

export default function ScanStore({ route }: RootScreenProps<Paths.SCAN_STORE>) {
  const { businessCode } = route.params;

  const {
    store,
    isFetchStoreLoading,
    isFetchStoreError,
    isQRCodeVisible,
    showQRCode,
    hideQRCode,
    handleOpenEmail,
    handleOpenPhone,
    handleOpenMaps,
    handlePay,
  } = useScanStore({ businessCode });

  const {
    shortAddress,
    isLoading: isGeocodingLoading,
    error: geocodingError,
  } = useShortAddress(
    store?.location?.latitude,
    store?.location?.longitude,
    !!store?.location?.latitude && !!store?.location?.longitude
  );

  if (isFetchStoreLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#3c83f6" />
      </View>
    );
  }

  if (isFetchStoreError || !store) {
    return (
      <View style={styles.loaderContainer}>
        <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
          Something went wrong on store fetching
        </Typography>
      </View>
    );
  }

  const { logoUrl, businessName, storeType, distance, businessEmail, businessPhone } = store;

  return (
    <SafeScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: logoUrl }} style={styles.logoImage} />
        </View>

        <View style={styles.storeInfoContainer}>
          <Typography fontVariant="medium" fontSize={30} color="#FFFFFF" textAlign="center">
            {businessName}
          </Typography>
          <Typography fontVariant="medium" fontSize={16} color="#3C83F6" textAlign="center">
            {store?.activeRewardProgram
              ? store?.activeRewardProgram?.strategy === EProgramStrategy.PERCENT_BACK
                ? `${store?.activeRewardProgram?.percentBack}% on purchases`
                : `Spend ${store?.activeRewardProgram?.spendThreshold} to earn ${store?.activeRewardProgram?.rewardPercent}%`
              : 'No specific reward program'}
          </Typography>

          <View style={styles.storeTypeAndDistanceContainer}>
            <View style={styles.storeTypeContainer}>
              {/* TODO: add icon for store type */}
              <IconByVariant path="bookstore" width={30} height={30} color="#8C8C8C" />
              <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
                {EIndustryDisplayNames[storeType as keyof typeof EIndustryDisplayNames]}
              </Typography>
            </View>
          </View>
          <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
            {distance ? `${distance} miles from you` : 'Address not available'}
          </Typography>
          <PrimaryButton label="Pay" onPress={handlePay} />
          {isQRCodeVisible && (
            <QrCodeSvg
              value={JSON.stringify({
                value: store?.businessCode || '',
                type: 'store_profile',
                role: ERole.USER,
              } satisfies QR_CODE)}
              frameSize={220}
              backgroundColor={'transparent'}
              dotColor={'#ffffff'}
              style={styles.qrCode}
            />
          )}
          {isQRCodeVisible ? (
            <TouchableOpacity
              onPress={hideQRCode}
              style={[styles.hideQRCodeButton, styles.qrCodeButtonContainer]}
            >
              <IconByVariant path="qr-blue" width={16} height={16} color={'#3c83f6'} />
              <Typography fontVariant="regular" fontSize={16} color={'#3c83f6'}>
                Hide QR
              </Typography>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={showQRCode}
              style={[styles.qrCodeButtonContainer, styles.showQRCodeButton]}
            >
              <IconByVariant path="qr-blue" width={16} height={16} color="#3c83f6" />
              <Typography fontVariant="regular" fontSize={16} color="#3c83f6">
                Show QR
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contactInfoContainer}>
          <TouchableOpacity style={styles.contactInfoItem} onPress={handleOpenEmail}>
            <IconByVariant path="email" width={20} height={20} color="#3069C5" />
            <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
              {businessEmail ?? 'No email yet'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactInfoItem} onPress={handleOpenPhone}>
            <IconByVariant path="phone" width={20} height={20} color="#3069C5" />
            <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
              {businessPhone ?? 'No phone yet'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactInfoItem} onPress={handleOpenMaps}>
            <IconByVariant path="location" width={20} height={20} color="#3069C5" />
            <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
              {isGeocodingLoading
                ? 'Loading address...'
                : geocodingError
                  ? 'Address not available'
                  : shortAddress || 'Address not available'}
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
