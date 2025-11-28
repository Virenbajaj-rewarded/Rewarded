import { View } from 'react-native';
import { OTPInput as BaseOTPInput } from 'input-otp-native';
import { Typography } from '@/components';
import { styles } from './OTPInput.styles';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  error?: string;
  touched?: boolean;
  maxLength?: number;
}

export default function OTPInput({
  value,
  onChange,
  onComplete,
  error,
  touched,
  maxLength = 6,
}: OTPInputProps) {
  const hasError = touched && error;

  return (
    <View style={styles.container}>
      <BaseOTPInput
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        render={({ slots }) => (
          <View style={styles.otpSlotsContainer}>
            {slots.map((slot, index) => (
              <View
                key={index}
                style={[
                  styles.otpSlot,
                  slot.isActive && styles.activeOtpSlot,
                  hasError && styles.errorOtpSlot,
                ]}
              >
                <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
                  {slot.char}
                </Typography>
              </View>
            ))}
          </View>
        )}
      />
      {hasError && (
        <Typography fontVariant="regular" fontSize={12} color="#FF6B6B" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
}
