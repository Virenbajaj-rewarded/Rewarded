import { useSetNewPassword } from './useSetNewPassword';
import { TextField, PrimaryButton } from '@/components';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import SafeScreen from '@/components/templates/SafeScreen';
import { ScrollView, View } from 'react-native';
import { styles } from './SetNewPassword.styles';
import { FormikProvider } from 'formik';

const SetNewPassword = ({ route }: RootScreenProps<Paths.SET_NEW_PASSWORD>) => {
  const { email, code } = route.params;

  const { formik, resetPasswordLoading } = useSetNewPassword(email, code);
  return (
    <FormikProvider value={formik}>
      <SafeScreen style={styles.container}>
        <ScrollView
          keyboardDismissMode="on-drag"
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <TextField
            secureTextEntry
            label="New Password"
            value={formik.values.newPassword}
            onChangeText={formik.handleChange('newPassword')}
            placeholder="New Password"
            onBlur={formik.handleBlur('newPassword')}
            error={
              formik.touched.newPassword && formik.errors.newPassword
                ? formik.errors.newPassword
                : undefined
            }
          />
          <TextField
            secureTextEntry
            label="Confirm New Password"
            value={formik.values.confirmNewPassword}
            onChangeText={formik.handleChange('confirmNewPassword')}
            placeholder="Confirm New Password"
            onBlur={formik.handleBlur('confirmNewPassword')}
            error={
              formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
                ? formik.errors.confirmNewPassword
                : undefined
            }
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={resetPasswordLoading ? 'Saving...' : 'Save Changes'}
            onPress={formik.handleSubmit}
            disabled={!formik.isValid || !formik.dirty}
          />
        </View>
      </SafeScreen>
    </FormikProvider>
  );
};

export default SetNewPassword;
