import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabsContainer: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  header: {
    padding: 16,
  },
  pointsIssuedContainer: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#0C1A31',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableUSDContainerWrapper: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  availableUSDContainer: {
    flex: 0.5,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#1F1F1F',
    justifyContent: 'space-between',
  },
  availableUSDBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availableUSDBalanceText: {
    flex: 1,
    flexShrink: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
