import { TouchableOpacity } from 'react-native';
import IconByVariant from '@/components/atoms/IconByVariant';
import { useNavigation } from '@react-navigation/native';
import { styles } from './BackButton.styles';

export default function BackButton() {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity
      hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
      style={styles.container}
      onPress={handlePress}
    >
      <IconByVariant path="arrow-left" width={20} height={20} />
    </TouchableOpacity>
  );
}
