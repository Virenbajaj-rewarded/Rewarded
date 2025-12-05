import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pointsInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: 38,
    lineHeight: 46,
    height: 200,
    textAlign: 'center',
  },
  formContainer: {
    gap: 200,
    paddingBottom: 20,
  },
  commentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#000000',
  },
  submitButton: {
    width: '100%',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 24,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#0C1A31',
  },
  cancelButtonText: {
    color: '#3f83f6',
  },
  tryAgainButton: {
    width: '100%',
  },
  textContainer: {
    gap: 8,
  },
});
