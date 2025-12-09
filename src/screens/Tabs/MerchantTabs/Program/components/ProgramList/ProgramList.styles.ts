import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
  },
  itemSeparator: {
    height: 24,
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
  addProgramButtonStyle: {
    backgroundColor: '#0C1A31',
    marginVertical: 24,
  },
  addProgramButtonTextStyle: {
    color: '#639CF8',
  },

  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  listHeaderContainer: {
    paddingBottom: 0,
  },
  createButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
