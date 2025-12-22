import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
    paddingBottom: 20,
    flex: 1,
  },
  commentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 8,
    paddingBottom: 8,
  },
  programLabel: {
    marginTop: -16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#000000',
  },
  creditButton: {
    width: '100%',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  successButton: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#0C1A31',
  },
  successButtonText: {
    color: '#639CF8',
  },

  errorButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  tryAgainButton: {
    width: '100%',
  },
  goToProgramsButton: {
    width: '100%',
    backgroundColor: '#0C1A31',
  },
  goToProgramsButtonText: {
    color: '#639CF8',
  },
  textContainer: {
    gap: 8,
  },
});
