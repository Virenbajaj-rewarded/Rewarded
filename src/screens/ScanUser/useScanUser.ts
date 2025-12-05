import { Paths } from '@/navigation/paths';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useFetchUserById } from '@/services/user/useUser';
import type { RootScreenProps } from '@/navigation/types';
import { ELedger } from '@/enums';

export const useScanUser = (
  userId: string,
  navigation: RootScreenProps<Paths.SCAN_USER>['navigation']
) => {
  const [selectedAction, setSelectedAction] = useState<ELedger>(ELedger.REQUEST);
  const { data: user, isLoading } = useFetchUserById(userId);

  const handleSelectAction = (action: ELedger) => {
    setSelectedAction(action);
  };

  const handleNext = () => {
    if (selectedAction === 'REQUEST') {
      navigation.navigate(Paths.REQUEST_POINTS, { userId });
    } else {
      navigation.navigate(Paths.CREDIT_POINTS, { userId });
    }
  };

  const handleOpenEmail = async () => {
    if (!user?.email) return;
    await Linking.openURL(`mailto:${user.email}`);
  };

  const handleOpenPhone = async () => {
    if (!user?.phone) return;
    const cleanPhone = user.phone.replace(/[\s\-()]/g, '');
    const phoneUrl = `tel:${cleanPhone}`;
    await Linking.openURL(phoneUrl);
  };

  useEffect(() => {
    if (user?.fullName) {
      navigation.setOptions({
        headerTitle: user.fullName,
      });
    }
  }, [user?.fullName, navigation]);

  return {
    handleNext,
    selectedAction,
    handleSelectAction,
    user,
    isLoading,
    handleOpenEmail,
    handleOpenPhone,
    navigation,
  };
};
