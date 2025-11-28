import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  otpSlotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  otpSlot: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOtpSlot: {
    borderColor: '#3c83f6',
    borderWidth: 2,
  },
  errorOtpSlot: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    marginTop: 8,
  },
});
