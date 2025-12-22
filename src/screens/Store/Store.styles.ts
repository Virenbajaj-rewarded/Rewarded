import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 45,
  },
  contentContainer: {
    gap: 16,
    paddingBottom: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    zIndex: 1,
  },
  logoOuter: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#3C83F6',
    alignItems: 'center',
    borderRadius: 8,
  },
  unlikeStoreButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 2,
  },
  storeInfoContainer: {
    backgroundColor: '#141414',
    borderRadius: 16,
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  storeTypeAndDistanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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

  rewardsAndSpentContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardPointsContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#3069C5',
  },
  spentContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: '#141414',
  },
  spendToEarnContainer: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  descriptionContainer: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  contactInfoContainer: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  leaveProgramButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  leaveProgramButtonText: {
    color: '#FF4D4F',
  },
});
