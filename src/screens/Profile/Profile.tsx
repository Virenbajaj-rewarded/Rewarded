import { ActivityIndicator, View } from 'react-native';
import type { RootScreenProps } from '@/navigation/types.ts';
import { Paths } from '@/navigation/paths.ts';
import { Typography, PrimaryButton, TextField, Modal } from '@/components';
import { FormikProvider } from 'formik';
import { styles } from './Profile.styles';
import { useProfile } from './useProfile';

export default function Profile({}: RootScreenProps<Paths.PROFILE>) {
  const {
    formik,
    isLoading,
    isError,
    isPending,
    navigateToChangePassword,
    handleDeleteAccount,
    isDeleteAccountModalVisible,
    showDeleteAccountModal,
    hideDeleteAccountModal,
    isLogoutModalVisible,
    showLogoutModal,
    hideLogoutModal,
    handleLogout,
  } = useProfile();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3c83f6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Typography fontVariant="regular" fontSize={16} color="#C13333">
          Something went wrong on profile fetching
        </Typography>
      </View>
    );
  }

  return (
    <FormikProvider value={formik}>
      <View style={styles.container}>
        <TextField
          label="Full Name"
          value={formik.values.fullName}
          onChangeText={formik.handleChange('fullName')}
          onBlur={formik.handleBlur('fullName')}
          placeholder="Full Name"
          error={
            formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : undefined
          }
        />

        <TextField
          label="Phone number"
          value={formik.values.phone}
          onChangeText={formik.handleChange('phone')}
          onBlur={formik.handleBlur('phone')}
          placeholder="Phone number"
          error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
          editable={false}
        />

        <TextField
          label="Email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          placeholder="Email"
          error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          editable={false}
        />

        {formik.dirty && (
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              label="Cancel"
              onPress={formik.resetForm}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
            <PrimaryButton
              label={isPending ? 'Saving...' : 'Save Changes'}
              onPress={formik.handleSubmit}
              style={styles.saveButton}
              disabled={!formik.isValid}
            />
          </View>
        )}

        {!formik.dirty && (
          <>
            <PrimaryButton
              label="Change Password"
              onPress={navigateToChangePassword}
              style={styles.changePasswordButton}
              textStyle={styles.changePasswordButtonText}
            />
            <PrimaryButton
              label="Log out"
              onPress={showLogoutModal}
              style={styles.transparentButton}
              textStyle={styles.logoutButtonText}
            />
            <PrimaryButton
              label="Delete Account"
              onPress={showDeleteAccountModal}
              style={styles.transparentButton}
              textStyle={styles.deleteAccountButtonText}
            />
          </>
        )}
      </View>
      <Modal
        visible={isDeleteAccountModalVisible}
        submitButtonType="delete"
        title="Delete Account?"
        description="if you delete your account now you will lose all your progress at all programs?"
        submitButtonLabel="Delete Account"
        cancelButtonLabel="Cancel"
        onSubmit={handleDeleteAccount}
        onCancel={hideDeleteAccountModal}
        onClose={hideDeleteAccountModal}
      />
      <Modal
        visible={isLogoutModalVisible}
        title="Log Out?"
        description="This will end your session on this device. You’ll need to sign in again to continue."
        submitButtonLabel="Log Out"
        cancelButtonLabel="Cancel"
        onSubmit={handleLogout}
        onCancel={hideLogoutModal}
        onClose={hideLogoutModal}
      />
    </FormikProvider>
  );
}
