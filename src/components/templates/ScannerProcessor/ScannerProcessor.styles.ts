import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  mask: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  scanArea: {
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: '#3c83f6',
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  hint: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.9,
  },
  goBackButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#3c83f6',
  },
  noCameraText: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
