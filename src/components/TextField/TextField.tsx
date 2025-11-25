import { TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components';
import { styles } from './TextField.styles';
import { ReactNode, useState } from 'react';
import IconByVariant from '@/components/atoms/IconByVariant';

type Props = TextInputProps & {
  testID?: string;
  label?: string;
  error?: string;
  rightAction?: ReactNode;
  mask?: string;
  required?: boolean;
};

export default function TextField({
  style,
  label,
  error,
  rightAction,
  editable,
  mask,
  value,
  secureTextEntry,
  required,
  ...rest
}: Props) {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(!!secureTextEntry);

  const toggleSecureTextEntry = () => {
    if (!secureTextEntry) {
      return;
    }
    setIsSecureTextEntry(previous => !previous);
  };

  const resolvedRightAction = secureTextEntry ? (
    <TouchableOpacity
      onPress={toggleSecureTextEntry}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={isSecureTextEntry ? 'Show password' : 'Hide password'}
    >
      <IconByVariant path={isSecureTextEntry ? 'eye-closed' : 'eye'} width={16} height={16} />
    </TouchableOpacity>
  ) : (
    rightAction
  );

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          {required && (
            <Typography fontVariant="regular" fontSize={14} color="#FF4D4F">
              {'*'}
            </Typography>
          )}

          <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
            {label}
          </Typography>
        </View>
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
            secureTextEntry || rightAction ? styles.inputWithButton : undefined,
            style,
          ]}
          value={value}
          secureTextEntry={secureTextEntry ? isSecureTextEntry : undefined}
          {...rest}
          aria-label={label}
          accessibilityLabel={label}
          editable={editable}
        />
        {(secureTextEntry || resolvedRightAction) && resolvedRightAction && (
          <View style={styles.rightAction}>{resolvedRightAction}</View>
        )}
      </View>
      {error && (
        <Typography fontVariant="regular" fontSize={12} color="#FF6B6B">
          {error}
        </Typography>
      )}
    </View>
  );
}
