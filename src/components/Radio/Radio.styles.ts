import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  radioList: {
    gap: 16,
  },
  radioOption: {
    backgroundColor: '#141414',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232323',
  },
  radioOptionSelected: {
    borderColor: '#3c83f6',
  },
  radioOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  circularRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularRadioInner: {
    borderRadius: 10,
  },
});
