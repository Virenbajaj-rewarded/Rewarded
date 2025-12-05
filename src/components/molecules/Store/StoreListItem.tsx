import { memo } from 'react';
import { IStoreListItem } from '@/services/stores/stores.types';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './StoreListItem.styles';
import IconByVariant from '@/components/atoms/IconByVariant';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths.ts';
import { Typography } from '@/components';
import { EIndustryDisplayNames } from '@/enums';
import { formatStrategyLabel } from '@/screens/Tabs/MerchantTabs/Program/utils';

const StoreListItem = ({
  store,
  handleUnlikeStore,
}: {
  store: IStoreListItem;
  handleUnlikeStore: (id: string) => void;
}) => {
  const navigation = useNavigation();
  const { logoUrl, name, rewardPoints, distance, businessCode, storeType, id } = store || {};

  const handleStorePress = () => {
    navigation.navigate(Paths.STORE, {
      businessCode,
    });
  };

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
          <Typography fontVariant="bold" fontSize={20} color="#FFFFFF">
            {name}
          </Typography>
          <TouchableOpacity
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
            onPress={() => handleUnlikeStore(id)}
          >
            <IconByVariant path="heart-filled" width={24} height={24} color="#3C83F6" />
          </TouchableOpacity>
        </View>
        <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
          {EIndustryDisplayNames[storeType]}
        </Typography>
        {distance && (
          <Typography fontVariant="regular" fontSize={14} color="#8C8C8C">
            {distance ? `${distance} miles from you` : 'Address not available'}
          </Typography>
        )}
        {store?.activeRewardProgram && (
          <Typography fontVariant="regular" fontSize={14} color="#3C83F6">
            {formatStrategyLabel(store?.activeRewardProgram)}
          </Typography>
        )}

        <Typography
          fontVariant={rewardPoints ? 'bold' : 'regular'}
          fontSize={rewardPoints ? 16 : 14}
          color={rewardPoints ? '#fff' : '#8C8C8C'}
        >
          {rewardPoints ? `${rewardPoints} rewards points` : 'Rewards currently inactive'}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

export default memo(StoreListItem);
