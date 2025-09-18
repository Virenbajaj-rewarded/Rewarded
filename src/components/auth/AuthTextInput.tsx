import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/theme';

type Props = TextInputProps & {
  testID?: string;
};

export default function AuthTextInput(props: Props) {
  const { colors } = useTheme();

  return (
    <TextInput
      placeholderTextColor={colors.gray400}
      style={{
        borderWidth: 1,
        borderColor: colors.gray200,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        color: colors.gray800,
      }}
      {...props}
    />
  );
}
