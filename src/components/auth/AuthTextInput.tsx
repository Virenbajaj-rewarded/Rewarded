import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/theme';

type Props = TextInputProps & {
  testID?: string;
};

export default function AuthTextInput({ style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <TextInput
      placeholderTextColor={colors.gray400}
      style={[
        {
          borderWidth: 1,
          borderColor: colors.gray200,
          paddingHorizontal: 12,
          paddingVertical: 12,
          height: 48,
          borderRadius: 12,
          marginBottom: 12,
          color: '#FFFFFF',
        },
        style,
      ]}
      {...rest}
    />
  );
}
