import { View } from 'react-native';
import { Typography } from '@/components';
import { styles } from './ProgressBar.styles';
import { ProgressBarProps } from './ProgressBar.types';

export default function ProgressBar({
  current,
  max,
  formatter = (value: number) => `CAD ${value.toLocaleString()}`,
  style,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${percentage}%` }]} />
        </View>
      </View>
      <View style={styles.labelsContainer}>
        <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
          {formatter(current)}
        </Typography>
        <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
          {formatter(max)}
        </Typography>
      </View>
    </View>
  );
}
