import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { Paths } from '@/navigation/paths';
import { useMerchant } from '@/services/merchant/useMerchant';

export const useBusiness = () => {
  const navigation = useNavigation();
  const { useFetchMerchantProfileQuery } = useMerchant();
  const { data: merchant, isLoading, isError } = useFetchMerchantProfileQuery();

  const navigateToEditBusiness = () => {
    navigation.navigate(Paths.EDIT_BUSINESS);
  };

  const handleOpenEmail = async () => {
    if (!merchant?.businessEmail) return;
    await Linking.openURL(`mailto:${merchant.businessEmail}`);
  };

  const handleOpenPhone = async () => {
    if (!merchant?.businessPhoneNumber) return;
    const cleanPhone = merchant.businessPhoneNumber.replace(/[\s\-()]/g, '');
    const phoneUrl = `tel:${cleanPhone}`;
    await Linking.openURL(phoneUrl);
  };

  const handleOpenMaps = async () => {
    if (!merchant?.location?.latitude || !merchant?.location?.longitude) return;

    const latitude = merchant.location.latitude;
    const longitude = merchant.location.longitude;
    const mapsUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;

    await Linking.openURL(mapsUrl);
  };

  const handleOpenTelegram = async () => {
    if (!merchant?.tgUsername) return;
    const username = merchant.tgUsername.replace('@', '');
    const telegramUrl = `https://t.me/${username}`;
    await Linking.openURL(telegramUrl);
  };

  const handleOpenWhatsApp = async () => {
    if (!merchant?.whatsppUsername) return;
    const phoneNumber = merchant.whatsppUsername.replace(/[\s\-()@]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    await Linking.openURL(whatsappUrl);
  };

  return {
    merchant,
    isLoading,
    isError,
    navigateToEditBusiness,
    handleOpenEmail,
    handleOpenPhone,
    handleOpenMaps,
    handleOpenTelegram,
    handleOpenWhatsApp,
  };
};
