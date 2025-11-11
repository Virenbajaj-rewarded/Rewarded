import { useState } from 'react';
import { Linking } from 'react-native';
import { useMyStores } from '@/services/stores/useStores';

export const useStore = ({ businessCode }: { businessCode: string }) => {
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
  };
};
