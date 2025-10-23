import { memo } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Typography } from '@/components';
import { styles } from './ProfileIcon.styles';
import { useUser } from '@/services/user/useUser';

const ProfileIcon = ({ onPress }: { onPress: () => void }) => {
  const { useFetchProfileQuery } = useUser();
  const { data: profile, isLoading, isError } = useFetchProfileQuery();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#3C83F6" />
      ) : (
        <Typography fontVariant="regular" fontSize={16} color="#3C83F6" textAlign="center">
          {isError || !profile?.fullName ? 'P' : profile?.fullName?.slice(0, 1)}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

export default memo(ProfileIcon);
