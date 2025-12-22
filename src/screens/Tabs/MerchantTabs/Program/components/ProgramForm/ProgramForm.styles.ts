import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    gap: 24,
    padding: 16,
  },
  cardContainer: {
    gap: 16,
    backgroundColor: '#141414',
    padding: 24,
    borderRadius: 16,
  },
  budgetContainer: {
    gap: 8,
  },
  draftButton: {
    backgroundColor: '#0C1A31',
  },
  draftButtonText: {
    color: '#639CF8',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: '#3C83F6',
  },
});
