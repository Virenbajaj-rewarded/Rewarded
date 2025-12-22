import { Paths } from '@/navigation/paths.ts';
import { Image, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import type { RootScreenProps } from '@/navigation/types.ts';
import { Typography, Modal, PrimaryButton } from '@/components';
import IconByVariant from '@/components/atoms/IconByVariant';
import ProgressBar from '@/components/ProgressBar';
import { QrCodeSvg } from 'react-native-qr-svg';
import { QR_CODE } from '@/types';
import { useStore } from './useStore';
import { styles } from './Store.styles';
import SafeScreen from '@/components/templates/SafeScreen';
import { EIndustryDisplayNames, EProgramStrategy, ERole, EOfferType } from '@/enums';
import { formatStrategyLabel } from '@/utils';

export default function Store({ route }: RootScreenProps<Paths.STORE>) {
  const { businessCode, isFromQrScanner } = route.params;

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
    handleOpenTelegram,
    handleOpenWhatsApp,
    handlePay,
    handleUnlikeStore,
    handleLikeStore,
    openLeaveProgramModal,
    handleLeaveProgram,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
  } = useStore({ businessCode });

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

  const {
    logoUrl,
    businessName,
    storeType,
    distance,
    isLiked,
    rewardPoints,
    description,
    spent,
    businessEmail,
    businessPhoneNumber,
    activeRewardProgram,
    location,
  } = store;

  const getRewardProgramText = () => {
    if (!activeRewardProgram) return 'No specific reward program';
    if (
      activeRewardProgram?.strategy === EProgramStrategy.PERCENT_BACK &&
      activeRewardProgram?.offerType === EOfferType.POINTS_CASHBACK
    ) {
      return `${activeRewardProgram?.percentBack} Points Instant Cashback`;
    } else if (
      activeRewardProgram?.strategy === EProgramStrategy.PERCENT_BACK &&
      activeRewardProgram?.offerType === EOfferType.FIXED_AMOUNT_POINTS
    ) {
      return `${activeRewardProgram?.percentBack} Points Instant Cashback`;
    } else if (
      activeRewardProgram?.strategy === EProgramStrategy.SPEND_TO_EARN &&
      activeRewardProgram?.offerType === EOfferType.POINTS_CASHBACK
    ) {
      return `Spend ${activeRewardProgram?.spendThreshold} to receive ${activeRewardProgram?.rewardPercent}% Cashback`;
    } else if (
      activeRewardProgram?.strategy === EProgramStrategy.SPEND_TO_EARN &&
      activeRewardProgram?.offerType === EOfferType.FIXED_AMOUNT_POINTS
    ) {
      return `Spend ${activeRewardProgram?.spendThreshold} to receive ${activeRewardProgram?.rewardPercent} Points`;
    }
    return 'No specific reward program';
  };

  const spendToEarnProgressPercentage = activeRewardProgram?.spendThreshold
    ? Math.round((spent / activeRewardProgram?.spendThreshold) * 100)
    : 0;

  return (
    <SafeScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            {logoUrl ? (
              <Image source={{ uri: logoUrl }} style={styles.logoImage} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Typography fontVariant="bold" fontSize={24} color="#fff">
                  Logo
                </Typography>
              </View>
            )}
          </View>
        </View>

        <View style={styles.storeInfoContainer}>
          <TouchableOpacity
            onPress={isLiked ? handleUnlikeStore : handleLikeStore}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.unlikeStoreButton}
          >
            <IconByVariant
              path={isLiked ? 'heart-filled' : 'heart'}
              width={24}
              height={24}
              color="#3C83F6"
            />
          </TouchableOpacity>
          <Typography fontVariant="medium" fontSize={30} color="#FFFFFF" textAlign="center">
            {businessName}
          </Typography>
          <Typography fontVariant="medium" fontSize={16} color="#3C83F6" textAlign="center">
            {getRewardProgramText()}
          </Typography>

          <View style={styles.storeTypeAndDistanceContainer}>
            <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
              {EIndustryDisplayNames[storeType]}
            </Typography>
            <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
              {distance ? `${distance} miles from you` : 'Address not available'}
            </Typography>
          </View>
          <PrimaryButton label="Pay" onPress={handlePay} />

          {isQRCodeVisible && (
            <View style={styles.qrCodeContainer}>
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
              <Typography fontVariant="regular" fontSize={20} color="#FFFFFF">
                {store?.businessCode}
              </Typography>
            </View>
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

        {activeRewardProgram && activeRewardProgram.strategy === EProgramStrategy.SPEND_TO_EARN && (
          <View style={styles.spendToEarnContainer}>
            <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
              {activeRewardProgram.name} Active
            </Typography>
            <Typography fontVariant="medium" fontSize={14} color="#8C8C8C">
              {spendToEarnProgressPercentage}% completed spend amount of CAD more to receive your
              cash back
            </Typography>
            <ProgressBar
              current={spent}
              max={activeRewardProgram.spendThreshold || 0}
              formatter={value => `CAD ${value.toLocaleString()}`}
            />
          </View>
        )}
        {!isFromQrScanner && activeRewardProgram && (
          <View style={styles.rewardsAndSpentContainer}>
            <View style={styles.rewardPointsContainer}>
              <Typography fontVariant="regular" fontSize={14} color="#D8E6FD">
                Rewards CAD Points
              </Typography>
              <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                {rewardPoints ?? 'No points yet'}
              </Typography>
            </View>
            <View style={styles.spentContainer}>
              <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
                Spent CAD Points
              </Typography>
              <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                {spent}
              </Typography>
            </View>
          </View>
        )}
        {description && (
          <View style={styles.descriptionContainer}>
            <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
              {description}
            </Typography>
          </View>
        )}
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
              {businessPhoneNumber ?? 'No phone yet'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactInfoItem} onPress={handleOpenMaps}>
            <IconByVariant path="location" width={20} height={20} color="#3069C5" />
            <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
              {location?.address || 'Address not available'}
            </Typography>
          </TouchableOpacity>

          {store.tgUsername && (
            <TouchableOpacity style={styles.contactInfoItem} onPress={handleOpenTelegram}>
              <IconByVariant path="telegram" width={20} height={20} color="#3C83F6" />
              <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
                {store.tgUsername}
              </Typography>
            </TouchableOpacity>
          )}

          {store.whatsppUsername && (
            <TouchableOpacity style={styles.contactInfoItem} onPress={handleOpenWhatsApp}>
              <IconByVariant path="whatsapp" width={20} height={20} color="#3C83F6" />
              <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
                {store.whatsppUsername}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
        {store?.activeRewardProgram && (
          <PrimaryButton
            label="Leave a program"
            onPress={openLeaveProgramModal}
            style={styles.leaveProgramButton}
            textStyle={styles.leaveProgramButtonText}
          />
        )}
      </ScrollView>
      <Modal
        visible={isLeaveProgramModalOpen}
        onClose={closeLeaveProgramModal}
        onCancel={closeLeaveProgramModal}
        submitButtonType="delete"
        title="Leave Program?"
        description={`If you leave ${store?.activeRewardProgram ? formatStrategyLabel(store?.activeRewardProgram) : ''} program at ${store?.businessName} program now, you might lose your ${store?.rewardPoints || 0} CAD points for this program. Are you sure?`}
        submitButtonLabel="Leave Program"
        cancelButtonLabel="Cancel"
        onSubmit={() => handleLeaveProgram(store.id ?? '')}
      />
    </SafeScreen>
  );
}
