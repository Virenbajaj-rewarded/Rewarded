import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  itemSeparator: {
    height: 24,
  },
  addProgramButtonStyle: {
    backgroundColor: '#0C1A31',
    marginVertical: 24,
  },
  addProgramButtonTextStyle: {
    color: '#639CF8',
  },
  programItem: {
    padding: 24,
    gap: 12,
    backgroundColor: '#141414',
    borderRadius: 16,
  },
  programItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programItemTags: {
    flexDirection: 'row',
    gap: 8,
  },
  programItemButtons: {
    gap: 16,
    marginTop: 16,
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
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
});
