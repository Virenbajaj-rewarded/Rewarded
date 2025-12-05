import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 24,
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactSection: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  button: {
    width: '100%',
    marginBottom: 24,
  },
});
