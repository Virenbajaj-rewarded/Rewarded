import { View, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MerchantTabCombinedScreenProps } from '@/navigation/types.ts';
import { MerchantTabPaths } from '@/navigation/paths.ts';
import { styles } from './Business.styles';
import { Typography, PrimaryButton } from '@/components';
import { useBusiness } from './useBusiness';
import SafeScreen from '@/components/templates/SafeScreen';
import IconByVariant from '@/components/atoms/IconByVariant';
import { EIndustryDisplayNames, EProgramStrategy } from '@/enums';

export default function Business({}: MerchantTabCombinedScreenProps<MerchantTabPaths.BUSINESS>) {
  const {
    merchant,
    isLoading,
    isError,
    navigateToEditBusiness,
    handleOpenEmail,
    handleOpenPhone,
    handleOpenMaps,
    handleOpenTelegram,
    handleOpenWhatsApp,
  } = useBusiness();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3c83f6" />
      </View>
    );
  }

  if (isError || !merchant) {
    return (
      <View style={styles.center}>
        <Typography fontVariant="regular" fontSize={16} color="#C13333">
          Something went wrong on business fetching
        </Typography>
      </View>
    );
  }

  return (
    <SafeScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.businessHeaderSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              {merchant.logoUrl ? (
                <Image source={{ uri: merchant.logoUrl }} style={styles.logoImage} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Typography fontVariant="bold" fontSize={24} color="#fff">
                    Logo
                  </Typography>
                </View>
              )}
            </View>
          </View>

          <Typography fontVariant="medium" fontSize={30} color="#FFFFFF" textAlign="center">
            {merchant.businessName}
          </Typography>

          <Typography fontVariant="regular" fontSize={14} color="#8C8C8C" textAlign="center">
            {merchant.storeType
              ? EIndustryDisplayNames[merchant.storeType as keyof typeof EIndustryDisplayNames]
              : 'Store'}
          </Typography>

          <Typography
            fontVariant="medium"
            fontSize={16}
            color="#3C83F6"
            textAlign="center"
            style={styles.cashback}
          >
            {merchant?.activeRewardProgram
              ? merchant?.activeRewardProgram?.strategy === EProgramStrategy.PERCENT_BACK
                ? `${merchant?.activeRewardProgram?.percentBack}% on purchases`
                : `Spend ${merchant?.activeRewardProgram?.spendThreshold} to earn ${merchant?.activeRewardProgram?.rewardPercent}%`
              : 'No specific reward program'}
          </Typography>
        </View>

        <View style={styles.descriptionSection}>
          <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
            {merchant.description || 'No description yet'}
          </Typography>
        </View>

        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.contactItem} onPress={handleOpenEmail}>
            <IconByVariant path="email" width={20} height={20} color="#3C83F6" />
            <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
              {merchant.businessEmail}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleOpenPhone}>
            <IconByVariant path="phone" width={20} height={20} color="#3C83F6" />
            <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
              {merchant.businessPhoneNumber}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleOpenMaps}>
            <IconByVariant path="location" width={20} height={20} color="#3C83F6" />
            <Typography
              fontVariant="regular"
              fontSize={14}
              color="#F5F5F5"
              style={styles.addressText}
            >
              {merchant.location?.address}
            </Typography>
          </TouchableOpacity>

          {merchant.tgUsername && (
            <TouchableOpacity style={styles.contactItem} onPress={handleOpenTelegram}>
              <IconByVariant path="telegram" width={20} height={20} color="#3C83F6" />
              <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
                {merchant.tgUsername}
              </Typography>
            </TouchableOpacity>
          )}

          {merchant.whatsppUsername && (
            <TouchableOpacity style={styles.contactItem} onPress={handleOpenWhatsApp}>
              <IconByVariant path="whatsapp" width={20} height={20} color="#3C83F6" />
              <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
                {merchant.whatsppUsername}
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        <PrimaryButton
          label="Edit"
          onPress={navigateToEditBusiness}
          icon={{ name: 'edit' }}
          style={styles.editButton}
          textStyle={styles.editButtonText}
        />
      </ScrollView>
    </SafeScreen>
  );
}
