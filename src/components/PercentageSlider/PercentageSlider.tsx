import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Typography } from '@/components';
import { styles } from './PercentageSlider.styles';
import { PercentageSliderProps } from './PercentageSlider.types';

export default function PercentageSlider({ value, onValueChange, label }: PercentageSliderProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Typography fontVariant="regular" fontSize={14} color="#FFFFFF" style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          value={value}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={100}
          tapToSeek
          step={1}
          minimumTrackTintColor={value > 0 ? '#3c83f6' : '#1F1F1F'}
          maximumTrackTintColor="#1F1F1F"
          thumbTintColor="transparent"
        />
        <View style={styles.valueContainer}>
          <Typography fontVariant="medium" fontSize={16} color="#FFFFFF">
            {Math.round(value)}%
          </Typography>
        </View>
      </View>
    </View>
  );
}
