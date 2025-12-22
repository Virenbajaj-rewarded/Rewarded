import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 16,
  },
  headerContainer: {
    paddingBottom: 0,
  },
  widgetsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  lifetimeSavings: {
    padding: 16,
    backgroundColor: '#3069C5',
    borderRadius: 16,
    marginBottom: 24,
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  rewardPointsBalance: {
    padding: 16,
    backgroundColor: '#0C1A31',
    borderRadius: 16,
    marginBottom: 24,
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
});
