import { StyleProp, ViewStyle } from 'react-native';

export interface ProgressBarProps {
  current: number;
  max: number;
  formatter?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}
