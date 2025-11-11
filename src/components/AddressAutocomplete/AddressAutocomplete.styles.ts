import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  listView: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#404040',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 1001,
  },
  scrollView: {
    maxHeight: 200,
  },
  row: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
});
