import { StyleProp, TextStyle } from 'react-native';

export type FontVariant = 'semibold' | 'medium' | 'regular' | 'bold';

export interface ITypography {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  fontVariant: FontVariant;
  fontSize: number;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}
