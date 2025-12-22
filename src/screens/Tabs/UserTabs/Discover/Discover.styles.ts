import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  headerContainer: {
    gap: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0C1A31',
    padding: 16,
    borderRadius: 16,
  },
  qrButton: {
    width: '100%',
    marginBottom: 16,
  },
  searchInput: {
    marginTop: 0,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});
