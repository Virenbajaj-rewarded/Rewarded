import { useState } from 'react';
import { Linking } from 'react-native';
import { useMyStores } from '@/services/stores/useStores';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

export const useStore = ({ businessCode }: { businessCode: string }) => {
  const navigation = useNavigation();
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const { useFetchStoreQuery } = useMyStores();

  const showQRCode = () => {
    setIsQRCodeVisible(true);
  };

  const hideQRCode = () => {
    setIsQRCodeVisible(false);
  };
  const {
    data: store,
    isLoading: isFetchStoreLoading,
    isError: isFetchStoreError,
  } = useFetchStoreQuery(businessCode);

  const handleOpenEmail = async () => {
    if (!store?.businessEmail) return;
    await Linking.openURL(`mailto:${store.businessEmail}`);
  };

  const handleOpenPhone = async () => {
    if (!store?.businessPhone) return;
    const cleanPhone = store.businessPhone.replace(/[\s\-()]/g, '');
    const phoneUrl = `tel:${cleanPhone}`;
    await Linking.openURL(phoneUrl);
  };

  const handleOpenMaps = async () => {
    if (!store?.location.latitude || !store?.location.longitude) return;

    const latitude = store.location.latitude;
    const longitude = store.location.longitude;
    const mapsUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;

    await Linking.openURL(mapsUrl);
  };

  const handlePay = () => {
    navigation.navigate(Paths.TOP_UP_STORE, {
      userId: store?.userId || '',
      storeName: store?.businessName || '',
    });
  };

  return {
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
  };
};
