import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#3c83f6',
    borderColor: '#3c83f6',
  },
  stepCircleCompleted: {
    backgroundColor: '#000',
    borderColor: '#3c83f6',
  },
  stepTitleContainer: {
    marginLeft: 12,
    alignItems: 'center',
  },
  activeUnderline: {
    width: '100%',
    height: 2,
    backgroundColor: '#3c83f6',
    marginTop: 4,
    borderRadius: 1,
  },
  connector: {
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
