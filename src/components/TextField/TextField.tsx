import { TextInput, TextInputProps, View } from 'react-native';
import { Typography } from '@/components';
import { styles } from './TextField.styles';

type Props = TextInputProps & {
  testID?: string;
  label?: string;
};

export default function TextField({ style, label, ...rest }: Props) {
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
    </View>
  );
}
