import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sliderWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  slider: {
    flex: 1,
    height: 40,
    transform: [{ scaleY: Platform.OS === 'ios' ? 2 : 4 }],
  },
  valueContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
});
