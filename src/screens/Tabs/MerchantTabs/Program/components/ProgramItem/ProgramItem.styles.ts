import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  programItem: {
    padding: 24,
    marginHorizontal: 16,
    gap: 12,
    backgroundColor: '#141414',
    borderRadius: 16,
  },
  programItemClickable: {
    gap: 12,
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
});
