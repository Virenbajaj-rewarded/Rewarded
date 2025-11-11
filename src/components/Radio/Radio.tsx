import { RadioButton } from 'react-native-paper';
import { IRadioGroup, IRadio } from './Radio.types';

export default function Radio({
  value,
  onPress,
  color = '#3c83f6',
  uncheckedColor = '#FFFFFF',
}: IRadio) {
  return (
    <RadioButton value={value} onPress={onPress} color={color} uncheckedColor={uncheckedColor} />
  );
}

export function RadioGroup({ value, onValueChange, children }: IRadioGroup) {
  return (
    <RadioButton.Group onValueChange={onValueChange} value={value}>
      {children}
    </RadioButton.Group>
  );
}
