import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    marginVertical: 24,
    backgroundColor: 'rgba(60,131,246,0.3)',
  },
  balanceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
