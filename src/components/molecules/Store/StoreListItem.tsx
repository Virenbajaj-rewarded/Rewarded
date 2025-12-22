import { memo } from 'react';
import { IStoreListItem } from '@/services/stores/stores.types';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './StoreListItem.styles';
import IconByVariant from '@/components/atoms/IconByVariant';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths.ts';
import { Typography } from '@/components';
import { EIndustryDisplayNames } from '@/enums';
import { formatStrategyLabel } from '@/utils';

type StoreListItemProps = {
  store: IStoreListItem;
  handleUnlikeStore: (id: string) => void;
  handleLikeStore?: (id: string) => void;
};

const StoreListItem = ({ store, handleUnlikeStore, handleLikeStore }: StoreListItemProps) => {
  const navigation = useNavigation();
  const { logoUrl, name, distance, businessCode, storeType, id, isLiked, activeRewardProgram } =
    store || {};

  const handleStorePress = () => {
    navigation.navigate(Paths.STORE, {
      businessCode,
    });
  };

  const handleHeartPress = () => {
    if (isLiked) {
      handleUnlikeStore(id);
    } else if (handleLikeStore) {
      handleLikeStore(id);
    }
  };

  const heartIcon = isLiked ? 'heart-filled' : 'heart';
  const heartColor = isLiked ? '#3C83F6' : '#FFFFFF';

  return (
    <TouchableOpacity style={styles.container} onPress={handleStorePress}>
      {logoUrl ? (
        <Image source={{ uri: logoUrl }} style={styles.photoImage} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
            Logo
          </Typography>
        </View>
      )}

      <View style={styles.infoList}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Typography fontVariant="bold" fontSize={20} color="#FFFFFF">
              {name}
            </Typography>
          </View>
          <TouchableOpacity
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
            onPress={handleHeartPress}
            style={styles.heartButton}
          >
            <IconByVariant path={heartIcon} width={24} height={24} color={heartColor} />
          </TouchableOpacity>
        </View>
        <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
          {EIndustryDisplayNames[storeType]}
        </Typography>
        <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
          {distance ? `${distance} miles from you` : 'Address not available'}
        </Typography>

        <Typography
          fontVariant="regular"
          fontSize={14}
          color={activeRewardProgram ? '#3C83F6' : '#C13333'}
        >
          {formatStrategyLabel(activeRewardProgram)}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

export default memo(StoreListItem);
