import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components';
import { RadioGroup } from '../../Radio';
import { CircularRadio } from '../CircularRadio';
import { styles } from './HorizontalRadioGroup.styles';
import { IHorizontalRadioGroup } from '@/components/Radio/Radio.types';

export function HorizontalRadioGroup({
  value,
  onValueChange,
  options,
  color = '#3c83f6',
  uncheckedColor = '#FFFFFF',
}: IHorizontalRadioGroup) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      <View style={styles.horizontalRadioGroup}>
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
