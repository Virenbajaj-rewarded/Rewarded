import { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { FontVariant, ITypography } from './Typography.types';

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
  numberOfLines,
  ellipsizeMode,
}: ITypography) => {
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

  return (
    <Text
      style={[dynamicStyle.text, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};

export default Typography;
