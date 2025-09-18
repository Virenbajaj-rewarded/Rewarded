import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
}

export default function PrimaryButton({ label, onPress, style, disabled, testID }: Props) {
  const { colors, fonts } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? colors.gray200 : colors.purple500,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={[fonts.size_16, { color: colors.gray50 }]}>{label}</Text>
    </TouchableOpacity>
  );
}
