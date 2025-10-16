import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { styles } from './PrimaryButton.styles';

interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  testID?: string;
}

export default function PrimaryButton({
  label,
  onPress,
  style,
  textStyle,
  disabled,
  testID,
}: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor: disabled ? '#232c34' : '#3c83f6' }, style]}
    >
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}
