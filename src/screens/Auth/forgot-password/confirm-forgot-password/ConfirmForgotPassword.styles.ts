import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    gap: 16,
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  cancelButtonText: {
    color: '#3c83f6',
  },
});
