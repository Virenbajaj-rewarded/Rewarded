import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  detailsContainer: {
    gap: 8,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonsContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  topUpButtonStyle: {
    backgroundColor: '#0C1A31',
  },
  topUpButtonTextStyle: {
    color: '#639CF8',
  },
  stopButtonStyle: {
    backgroundColor: 'transparent',
  },
  stopButtonTextStyle: {
    color: '#FF4D4F',
  },
  transparentButtonStyle: {
    backgroundColor: 'transparent',
  },
  editButtonTextStyle: {
    color: '#3C83F6',
  },
});
