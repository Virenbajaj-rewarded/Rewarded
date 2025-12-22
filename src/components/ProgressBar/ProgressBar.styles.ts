import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  barContainer: {
    width: '100%',
  },
  barBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#1F1F1F',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3c83f6',
    borderRadius: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

