import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#3C83F6',
  },
  cancelButtonText: {
    color: '#3C83F6',
  },
  saveButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3c83f6',
    color: '#fff',
  },
  changePasswordButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  changePasswordButtonText: {
    color: '#3c83f6',
  },
  deleteAccountButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  deleteAccountButtonText: {
    color: '#FF4D4F',
  },
});
