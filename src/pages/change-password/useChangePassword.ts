import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { useAuth } from '@/services/auth';
import { changePasswordValidationSchema } from './ChangePassword.validation';
import { ChangePasswordFormValues } from './ChangePassword.types';

export const useChangePassword = () => {
  const navigate = useNavigate();
  const { changePassword, isChangePasswordLoading, logout } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.PROFILE);
    }
  };
  const handleSubmit = async (values: ChangePasswordFormValues) => {
    const { oldPassword, newPassword } = values;
    await changePassword({ oldPassword, newPassword });
    await logout();
    navigate(ROUTES.CHOOSE_ROLE);
  };

  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: handleSubmit,
  });

  const handleCancel = () => {
    formik.resetForm();
    handleGoBack();
  };

  return {
    formik,
    isChangePasswordLoading,
    handleGoBack,
    handleCancel,
  };
};
