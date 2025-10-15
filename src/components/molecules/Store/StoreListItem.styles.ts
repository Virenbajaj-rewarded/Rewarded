import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1F1F1F',
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 24,
    padding: 16,
    gap: 4,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignSelf: 'center',
  },
  infoList: {
    flex: 1,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
