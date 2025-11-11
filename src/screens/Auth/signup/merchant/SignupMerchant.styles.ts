import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    gap: 16,
  },
  stepperContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
});
