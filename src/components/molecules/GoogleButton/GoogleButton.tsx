import { ActivityIndicator, Alert, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { styles } from './styles';
import IconByVariant from '@/components/atoms/IconByVariant';
import Typography from '@/components/Typography/Typography';

interface GoogleButtonProps extends Omit<TouchableOpacityProps, 'style' | 'onPress'> {
  onPress: () => void;
  loading?: boolean;
  text?: string;
}

export default function GoogleButton({ onPress, loading, text, ...props }: GoogleButtonProps) {
  const handlePress = async () => {
    try {
      await onPress();
    } catch (e) {
      const error = e as Error;
      Alert.alert(error?.message || 'Error', 'Please try again later', [{ text: 'OK' }], {
        cancelable: true,
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={props?.disabled || loading}
      {...props}
    >
      <IconByVariant path="google" width={20} height={20} />

      <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
        {text || 'Continue with Google'}
      </Typography>
      {loading && <ActivityIndicator />}
    </TouchableOpacity>
  );
}
