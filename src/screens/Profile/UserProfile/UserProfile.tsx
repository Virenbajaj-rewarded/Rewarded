import { ActivityIndicator, View } from 'react-native';
import type { RootScreenProps } from '@/navigation/types.ts';
import { Paths } from '@/navigation/paths.ts';
import { Typography, PrimaryButton, TextField } from '@/components';
import { FormikProvider } from 'formik';
import { styles } from './UserProfile.styles';
import { useUserProfile } from './useUserProfile';
import LogoutButton from '@/components/atoms/LogoutButton';

export default function UserProfile({ navigation }: RootScreenProps<Paths.USER_PROFILE>) {
  const { formik, isLoading, isError, isPending, navigateToChangePassword, handleDeleteAccount } =
    useUserProfile();

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
        />

        <TextField
          label="Email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          placeholder="Email"
          error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
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
            <LogoutButton />
            <PrimaryButton
              label="Change Password"
              onPress={navigateToChangePassword}
              style={styles.changePasswordButton}
              textStyle={styles.changePasswordButtonText}
            />
            <PrimaryButton
              label="Delete Account"
              onPress={handleDeleteAccount}
              style={styles.deleteAccountButton}
              textStyle={styles.deleteAccountButtonText}
            />
          </>
        )}
      </View>
    </FormikProvider>
  );
}
