import { memo } from 'react';
import { StoreListItemType } from '@/services/stores/schema';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './StoreListItem.styles';
import IconByVariant from '@/components/atoms/IconByVariant';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths.ts';
import { Typography } from '@/components';

const StoreListItem = (store: StoreListItemType) => {
  const navigation = useNavigation();
  const { logoUrl, name, rewardPoints, distance, id, storeType } = store || {};

  const handleStorePress = () => {
    navigation.navigate(Paths.Store, {
      storeId: id,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleStorePress}>
      <Image source={{ uri: logoUrl }} style={styles.logoImage} width={60} height={60} />

      <View style={styles.infoList}>
        <View style={styles.infoItem}>
          <Typography fontVariant="bold" fontSize={20} color="#FFFFFF">
            {name}
          </Typography>
          <TouchableOpacity
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
            onPress={() => {
              console.warn('remove from favorites');
              //TODO: add action to show modal to remove from favorites
            }}
          >
            <IconByVariant path="heart-filled" width={24} height={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.storeTypeContainer}>
            {/* TODO: add icon for store type */}
            <IconByVariant path="bookstore" width={20} height={20} color="#8C8C8C" />
            <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
              {storeType}
            </Typography>
          </View>
          <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
            {distance ? `${distance} miles from you` : 'Address not available'}
          </Typography>
        </View>
        <View style={styles.infoItem}>
          <Typography fontVariant="medium" fontSize={14} color="#3C83F6">
            {rewardPoints ? `${rewardPoints} rewards points` : 'No rewards points'}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(StoreListItem);
