import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginBottom: 24,
  },
  buttonsContainer: {
    gap: 10,
  },
  submitDeleteButton: {
    backgroundColor: '#FF455C',
  },
  submitButton: {
    height: 40,
    backgroundColor: '#3c83f6',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    height: 40,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: '#3C83F6',
  },
});
