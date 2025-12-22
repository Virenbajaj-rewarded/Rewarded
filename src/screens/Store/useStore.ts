import { useState } from 'react';
import { Linking } from 'react-native';
import { useMyStores } from '@/services/stores/useStores';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

export const useStore = ({ businessCode }: { businessCode: string }) => {
  const navigation = useNavigation();
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [isLeaveProgramModalOpen, setIsLeaveProgramModalOpen] = useState(false);

  const { useFetchStoreQuery, unlikeStore, likeStore } = useMyStores();

  const handleGoBack = () => navigation.goBack();

  const showQRCode = () => setIsQRCodeVisible(true);
  const hideQRCode = () => setIsQRCodeVisible(false);

  const openLeaveProgramModal = () => setIsLeaveProgramModalOpen(true);
  const closeLeaveProgramModal = () => setIsLeaveProgramModalOpen(false);

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
    if (!store?.businessPhoneNumber) return;
    const cleanPhone = store.businessPhoneNumber.replace(/[\s\-()]/g, '');
    const phoneUrl = `tel:${cleanPhone}`;
    await Linking.openURL(phoneUrl);
  };

  const handleOpenMaps = async () => {
    if (!store?.location?.latitude || !store?.location?.longitude) return;

    const latitude = store.location.latitude;
    const longitude = store.location.longitude;
    const mapsUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;

    await Linking.openURL(mapsUrl);
  };

  const handleOpenTelegram = async () => {
    if (!store?.tgUsername) return;
    const username = store.tgUsername.replace('@', '');
    const telegramUrl = `https://t.me/${username}`;
    await Linking.openURL(telegramUrl);
  };

  const handleOpenWhatsApp = async () => {
    if (!store?.whatsppUsername) return;
    const phoneNumber = store.whatsppUsername.replace(/[\s\-()@]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    await Linking.openURL(whatsappUrl);
  };

  const handlePay = () => {
    navigation.navigate(Paths.TOP_UP_STORE, {
      userId: store?.userId || '',
      storeName: store?.businessName || '',
    });
  };

  const handleUnlikeStore = async () => {
    if (!store?.id) return;

    if (store?.activeRewardProgram) {
      openLeaveProgramModal();
    } else {
      await unlikeStore(store.id);
      handleGoBack();
    }
  };

  const handleLikeStore = async () => {
    if (!store?.id) return;
    await likeStore(store.id);
    handleGoBack();
  };

  const handleLeaveProgram = async (storeId: string) => {
    await unlikeStore(storeId);
    closeLeaveProgramModal();
    handleGoBack();
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
    handleOpenTelegram,
    handleOpenWhatsApp,
    handlePay,
    handleUnlikeStore,
    handleLikeStore,
    openLeaveProgramModal,
    handleLeaveProgram,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
  };
};
