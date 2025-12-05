import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 45,
    marginBottom: 24,
  },
  contentContainer: {
    gap: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: -40,
    zIndex: 2,
    alignSelf: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  storeInfoContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  storeTypeAndDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  storeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qrCodeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderColor: '#3c83f6',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  showQRCodeButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  hideQRCodeButton: {
    backgroundColor: '#000000',
  },
  qrCode: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  lifetimeSavingsContainer: {
    backgroundColor: '#3069C5',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  rewardsAndSpentContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardPointsContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#1F1F1F',
  },
  spentContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#1F1F1F',
  },
  contactInfoContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
