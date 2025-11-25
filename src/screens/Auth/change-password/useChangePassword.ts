import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/services/auth/useAuth';
import { changePasswordValidationSchema } from './ChangePassword.validation';
import { ChangePasswordForm } from './ChangePassword.types';

export const useChangePassword = () => {
  const navigation = useNavigation();
  const { changePassword, changePasswordLoading, signOut } = useAuth();

  const handleChangePassword = async (values: ChangePasswordForm) => {
    try {
      const { oldPassword, newPassword } = values;
      await changePassword({ oldPassword, newPassword });
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik<ChangePasswordForm>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordValidationSchema,
    enableReinitialize: true,
    onSubmit: handleChangePassword,
  });

  const handleCancel = () => {
    formik.resetForm();
    navigation.goBack();
  };

  return {
    formik,
    isLoading: changePasswordLoading,
    handleCancel,
  };
};
