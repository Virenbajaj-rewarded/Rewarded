import { useAuth } from '@/services/auth/useAuth';
import { setNewPasswordValidationSchema } from './SetNewPassword.validation';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ERole } from '@/enums';

export const useSetNewPassword = (email: string, code: string) => {
  const navigation = useNavigation();
  const { resetPassword, resetPasswordLoading } = useAuth();

  const handleResetPassword = async (values: {
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    try {
      await resetPassword({ email, code, newPassword: values.newPassword });
      navigation.navigate(Paths.LOGIN, { role: ERole.MERCHANT });
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: setNewPasswordValidationSchema,
    onSubmit: handleResetPassword,
  });

  return {
    formik,
    resetPasswordLoading,
  };
};
