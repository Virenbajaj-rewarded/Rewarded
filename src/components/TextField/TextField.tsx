import { TextInput, TextInputProps, View } from 'react-native';
import { Typography } from '@/components';
import { styles } from './TextField.styles';
import { ReactNode } from 'react';
type Props = TextInputProps & {
  testID?: string;
  label?: string;
  error?: string;
  rightAction?: ReactNode;
  mask?: string;
};

export default function TextField({
  style,
  label,
  error,
  rightAction,
  editable,
  mask,
  value,
  ...rest
}: Props) {
  return (
    <View style={styles.container}>
      {label && (
        <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
          {label}
        </Typography>
      )}
      <View style={styles.inputContainer}>
        {mask && value && (
          <View style={styles.maskContainer}>
            <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
              {mask}
            </Typography>
          </View>
        )}
        <TextInput
          placeholderTextColor={'#4D4D4D'}
          style={[
            styles.input,
            mask && value ? styles.inputWithMask : undefined,
            rightAction ? styles.inputWithButton : undefined,
            style,
          ]}
          value={value}
          {...rest}
          aria-label={label}
          accessibilityLabel={label}
          editable={editable}
        />
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>
      {error && (
        <Typography fontVariant="regular" fontSize={12} color="#FF6B6B">
          {error}
        </Typography>
      )}
    </View>
  );
}
