import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1F1F1F',
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 24,
    padding: 16,
    gap: 16,
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    flexShrink: 1,
  },
  heartButton: {
    flexShrink: 0,
  },
  storeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
});
