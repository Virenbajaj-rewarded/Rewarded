import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { styles } from './PrimaryButton.styles';
import IconByVariant from '../atoms/IconByVariant';

interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: { name: string; color?: string; width?: number; height?: number };
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
  icon,
}: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#1F1F1F' : '#3c83f6',
        },
        style,
      ]}
    >
      <View style={styles.contentContainer}>
        {icon && (
          <IconByVariant
            path={icon.name}
            width={icon.width || 16}
            height={icon.height || 16}
            color={icon.color || '#3c83f6'}
          />
        )}
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
