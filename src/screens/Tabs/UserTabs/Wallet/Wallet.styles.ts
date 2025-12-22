import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 16,
  },
  earnedPointsContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(60,131,246,0.3)',
    marginTop: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  purchasedPointsContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(60,131,246,0.3)',
    marginTop: 16,
  },
  qrCodeTitle: {
    marginTop: 24,
  },
  qrCode: {
    marginHorizontal: 'auto',
    marginTop: 16,
  },
  transactionHistoryContainer: {
    marginTop: 24,
  },

  dateHeader: {
    paddingVertical: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  transactionDescription: {
    flex: 1,
    marginRight: 12,
  },
  transactionIconContainer: {
    width: 28,
    alignItems: 'center',
    marginRight: 8,
  },
  transactionAmount: {
    minWidth: 90,
    textAlign: 'right',
  },

  stateContainer: {
    padding: 16,
    alignItems: 'center',
  },
});
