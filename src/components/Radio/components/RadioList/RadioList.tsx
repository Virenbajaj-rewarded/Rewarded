import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components';
import IconByVariant from '@/components/atoms/IconByVariant';
import { IRadioList, IRadioOptionProps } from '@/components/Radio/Radio.types';
import { RadioGroup } from '../../Radio';
import { CircularRadio } from '../CircularRadio';
import { styles } from '../../Radio.styles';

function RadioOption({ option, isSelected, onPress, color, uncheckedColor }: IRadioOptionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.radioOption, isSelected && styles.radioOptionSelected]}
    >
      <View style={styles.radioOptionHeader}>
        <CircularRadio selected={isSelected} color={color} uncheckedColor={uncheckedColor} />
        {option.icon && <IconByVariant path={option.icon} height={24} width={24} />}
        <Typography fontVariant="regular" fontSize={18} color="#FFFFFF">
          {option.label}
        </Typography>
      </View>
      {option.description && (
        <Typography fontVariant="regular" fontSize={14} color="#F0F0F0">
          {option.description}
        </Typography>
      )}
    </TouchableOpacity>
  );
}

export function RadioList({
  value,
  onValueChange,
  options,
  color = '#3c83f6',
  uncheckedColor = '#FFFFFF',
}: IRadioList) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      <View style={styles.radioList}>
        {options.map(option => (
          <RadioOption
            key={option.value}
            option={option}
            isSelected={value === option.value}
            onPress={() => onValueChange(option.value)}
            color={color}
            uncheckedColor={uncheckedColor}
          />
        ))}
      </View>
    </RadioGroup>
  );
}
