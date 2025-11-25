import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    marginTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  businessHeaderSection: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 24,
    paddingTop: 40,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
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
  businessName: {
    marginBottom: 4,
  },
  industry: {
    marginBottom: 8,
  },
  cashback: {
    marginBottom: 0,
  },
  descriptionSection: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  contactSection: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#3C83F6',
    backgroundColor: 'transparent',
  },
  editButtonText: {
    color: '#3C83F6',
  },
  addressText: {
    flex: 1,
  },
});
