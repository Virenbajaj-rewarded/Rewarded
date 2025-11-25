import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { FormikProvider } from 'formik';
import { PrimaryButton, TextField } from '@/components';
import { styles } from './ChangePassword.styles';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import SafeScreen from '@/components/templates/SafeScreen';
import { useChangePassword } from './useChangePassword';

const ChangePassword = ({}: RootScreenProps<Paths.CHANGE_PASSWORD>) => {
  const { formik, isLoading, handleCancel } = useChangePassword();

  return (
    <SafeScreen edges={['bottom', 'left', 'right', 'top']}>
      <FormikProvider value={formik}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.block}>
              <TextField
                label="Current Password"
                placeholder="Enter current password"
                secureTextEntry
                value={formik.values.oldPassword}
                onChangeText={formik.handleChange('oldPassword')}
                onBlur={formik.handleBlur('oldPassword')}
                error={
                  formik.touched.oldPassword && formik.errors.oldPassword
                    ? formik.errors.oldPassword
                    : undefined
                }
              />

              <TextField
                label="New Password"
                placeholder="Enter new password"
                secureTextEntry
                value={formik.values.newPassword}
                onChangeText={formik.handleChange('newPassword')}
                onBlur={formik.handleBlur('newPassword')}
                error={
                  formik.touched.newPassword && formik.errors.newPassword
                    ? formik.errors.newPassword
                    : undefined
                }
              />

              <TextField
                label="Confirm New Password"
                placeholder="Confirm new password"
                secureTextEntry
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange('confirmPassword')}
                onBlur={formik.handleBlur('confirmPassword')}
                error={
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : undefined
                }
              />
            </View>

            <View style={styles.block}>
              <PrimaryButton
                label={isLoading ? 'Saving...' : 'Save Changes'}
                onPress={formik.handleSubmit}
                disabled={!formik.dirty || !formik.isValid}
              />
              <PrimaryButton
                label="Cancel"
                onPress={handleCancel}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </FormikProvider>
    </SafeScreen>
  );
};

export default ChangePassword;
