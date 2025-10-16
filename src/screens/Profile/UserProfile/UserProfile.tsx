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
          placeholder="Full Name"
        />
        {formik.errors.fullName && (
          <Typography fontVariant="regular" fontSize={12} color="#C13333">
            {formik.errors.fullName}
          </Typography>
        )}

        <TextField
          label="Phone number"
          value={formik.values.phone}
          onChangeText={formik.handleChange('phone')}
          placeholder="Phone number"
        />
        {formik.errors.phone && (
          <Typography fontVariant="regular" fontSize={12} color="#C13333">
            {formik.errors.phone}
          </Typography>
        )}

        <TextField
          label="Email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          placeholder="Email"
        />
        {formik.errors.email && (
          <Typography fontVariant="regular" fontSize={12} color="#C13333">
            {formik.errors.email}
          </Typography>
        )}
        <PrimaryButton
          label={isPending ? 'Saving...' : 'Save Changes'}
          onPress={formik.handleSubmit}
          style={styles.saveButton}
          disabled={!formik.dirty || !formik.isValid}
        />

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
      </View>
    </FormikProvider>
  );
}
