import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Typography, PrimaryButton, RadioList } from '@/components';
import { RootScreenProps } from '@/navigation/types';
import SafeScreen from '@/components/templates/SafeScreen';
import { Paths } from '@/navigation/paths';
import { useScanUser } from './useScanUser';
import { styles } from './ScanUser.styles';
import IconByVariant from '@/components/atoms/IconByVariant';
import { ELedger } from '@/enums';

const actionOptions = [
  {
    value: 'REQUEST',
    label: 'Request CAD Points',
    description: 'Let the User pay with the earned CAD points',
    icon: 'request-points',
  },
  {
    value: 'CREDIT',
    label: 'Credit CAD Points',
    description: 'Give the user rewarded CAD points',
    icon: 'credit-points',
  },
];

export default function ScanUser({ route, navigation }: RootScreenProps<Paths.SCAN_USER>) {
  const userId = route.params.userId;
  const {
    handleNext,
    selectedAction,
    handleSelectAction,
    user,
    isLoading,
    handleOpenEmail,
    handleOpenPhone,
  } = useScanUser(userId, navigation);

  if (isLoading) {
    return (
      <SafeScreen style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3c83f6" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.content}>
        <RadioList
          value={selectedAction}
          onValueChange={value => handleSelectAction(value as ELedger)}
          options={actionOptions}
          color="#3c83f6"
          uncheckedColor="#FFFFFF"
        />
        <View style={styles.contactSection}>
          {user?.phone && (
            <TouchableOpacity style={styles.contactItem} onPress={handleOpenPhone}>
              <IconByVariant path="phone" width={20} height={20} color="#3C83F6" />
              <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
                {user.phone}
              </Typography>
            </TouchableOpacity>
          )}
          {user?.email && (
            <TouchableOpacity style={styles.contactItem} onPress={handleOpenEmail}>
              <IconByVariant path="email" width={20} height={20} color="#3C83F6" />
              <Typography fontVariant="regular" fontSize={14} color="#F5F5F5">
                {user.email}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <PrimaryButton label="Next" onPress={handleNext} style={styles.button} />
    </SafeScreen>
  );
}
