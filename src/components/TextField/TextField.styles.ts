import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#171f26',
    backgroundColor: '#1F1F1F',
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  pointsInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: 38,
    lineHeight: 46,
    height: 50,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  inputWithMask: {
    paddingLeft: 50,
  },
  inputWithButton: {
    paddingRight: 50,
  },
  maskContainer: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  rightAction: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
