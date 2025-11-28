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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
});
