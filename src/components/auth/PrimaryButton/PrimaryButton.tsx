import { TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';
import { styles } from './PrimaryButton.styles';

interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
}

export default function PrimaryButton({ label, onPress, style, disabled, testID }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor: disabled ? '#232c34' : '#3c83f6' }, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
