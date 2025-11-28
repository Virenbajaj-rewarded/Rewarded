import { TouchableOpacity, Text } from 'react-native';
import { ICheckbox } from './Checkbox.types';
import { styles } from './Checkbox.styles';

export default function Checkbox({
  checked,
  onPress,
  checkedColor = '#FFFFFF',
  checkedBackgroundColor = '#3c83f6',
  uncheckedBackgroundColor = '#1f1f1f',
}: ICheckbox) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.checkbox,
        {
          backgroundColor: checked ? checkedBackgroundColor : uncheckedBackgroundColor,
          borderColor: checked ? checkedBackgroundColor : uncheckedBackgroundColor,
        },
      ]}
    >
      {checked && <Text style={[styles.checkmark, { color: checkedColor }]}>✓</Text>}
    </TouchableOpacity>
  );
}
