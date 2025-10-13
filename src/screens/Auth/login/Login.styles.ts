import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
  },
  errorInput: {
    borderColor: '#C13333',
  },
  errorText: {
    fontSize: 12,
    color: '#C13333',
    marginTop: -8,
    marginBottom: 8,
  },
  authErrorText: {
    fontSize: 12,
    color: '#C13333',
    marginBottom: 8,
  },
  loginButton: {
    marginBottom: 12,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    marginHorizontal: 'auto',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#0c141b',
  },
  inputWrapper: {
    marginBottom: 8,
  },
});
