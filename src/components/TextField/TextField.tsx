import { TextInput, TextInputProps, View } from 'react-native';
import { Typography } from '@/components';
import { styles } from './TextField.styles';

type Props = TextInputProps & {
  testID?: string;
  label?: string;
  error?: string;
};

export default function TextField({ style, label, error, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
        {label}
      </Typography>
      <TextInput
        placeholderTextColor={'#4D4D4D'}
        style={[styles.input, style]}
        {...rest}
        aria-label={label}
        accessibilityLabel={label}
      />
      {error && (
        <Typography fontVariant="regular" fontSize={12} color="#FF6B6B">
          {error}
        </Typography>
      )}
    </View>
  );
}
