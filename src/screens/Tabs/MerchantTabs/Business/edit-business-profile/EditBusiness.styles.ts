import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#3C83F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  changePhotoButton: {
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 8,
  },
  textArea: {
    height: 100,
    minHeight: 100,
    maxHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 8,
    paddingBottom: 8,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  cancelButtonText: {
    color: '#3C83F6',
  },
});
