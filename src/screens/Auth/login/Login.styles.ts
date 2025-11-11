import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: '#141414',
    gap: 16,
  },

  signupContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  signupText: {
    color: '#3c83f6',
  },
});
