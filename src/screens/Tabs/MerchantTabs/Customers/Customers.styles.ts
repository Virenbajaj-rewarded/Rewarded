import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 16,
  },
  stateContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  totalCustomersContainer: {
    flex: 0.5,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#3C83F6',
    justifyContent: 'space-between',
  },
  newCustomersContainer: {
    flex: 0.5,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#0C1A31',
    justifyContent: 'space-between',
  },
  pointsContainerWrapper: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  pointsContainer: {
    flex: 0.5,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#1F1F1F',
    justifyContent: 'space-between',
  },
  pointsBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  customerPoints: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
