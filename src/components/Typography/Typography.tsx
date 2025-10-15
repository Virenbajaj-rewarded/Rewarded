import { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { StyleProp, TextStyle } from 'react-native';
import { FontVariant } from './types';

const getFontFamily = (fontVariant: FontVariant): string => {
  switch (fontVariant) {
    case 'semibold':
      return 'Roboto-SemiBold';
    case 'medium':
      return 'Roboto-Medium';
    case 'regular':
      return 'Roboto-Regular';
    case 'bold':
      return 'Roboto-Bold';
    default:
      return 'Roboto-Regular';
  }
};

const Typography = ({
  children,
  style,
  fontVariant = 'regular',
  fontSize = 16,
  color = '#FFFFFF',
  textAlign = 'left',
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  fontVariant: FontVariant;
  fontSize: number;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
}) => {
  const dynamicStyle = useMemo(
    () =>
      StyleSheet.create({
        text: {
          fontFamily: getFontFamily(fontVariant),
          fontSize,
          lineHeight: fontSize + 8,
          color,
          textAlign,
        },
      }),
    [fontVariant, fontSize, color, textAlign]
  );

  return <Text style={[dynamicStyle.text, style]}>{children}</Text>;
};

export default Typography;
