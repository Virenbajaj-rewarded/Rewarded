import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components';
import { RadioGroup } from '../../Radio';
import { CircularRadio } from '../CircularRadio';
import { styles } from './CircularRadioGroup.styles';
import { ICircularRadioGroup } from '@/components/Radio/Radio.types';

export function CircularRadioGroup({
  value,
  onValueChange,
  options,
  color = '#3c83f6',
  uncheckedColor = '#FFFFFF',
  direction = 'horizontal',
  style,
}: ICircularRadioGroup) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      <View
        style={[
          direction === 'horizontal' ? styles.horizontalRadioGroup : styles.verticalRadioGroup,
          style,
        ]}
      >
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.radioItem}
            onPress={() => onValueChange(option.value)}
          >
            <CircularRadio
              selected={value === option.value}
              color={color}
              uncheckedColor={uncheckedColor}
              size={16}
            />
            <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
              {option.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </RadioGroup>
  );
}
