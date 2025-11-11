import { View } from 'react-native';
import { ICircularRadioProps } from '../../Radio.types';
import { styles } from '../../Radio.styles';

export function CircularRadio({
  selected,
  color = '#3c83f6',
  uncheckedColor = '#FFFFFF',
  size = 20,
}: ICircularRadioProps) {
  return (
    <View style={[styles.circularRadio, { borderColor: selected ? color : uncheckedColor }]}>
      {selected && (
        <View
          style={[
            styles.circularRadioInner,
            { backgroundColor: color, width: size * 0.5, height: size * 0.5 },
          ]}
        />
      )}
    </View>
  );
}
