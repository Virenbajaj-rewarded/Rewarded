import { forgotPasswordValidationSchema } from './ForgotPassword.validation';
import { useFormik } from 'formik';
import { useAuth } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { ERole } from '@/enums';

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, isRequestPasswordResetLoading } = useAuth();

  const onSubmit = async (values: { email: string }) => {
    await requestPasswordReset(values.email);
    navigate(ROUTES.CONFIRM_FORGOT_PASSWORD, {
      state: { email: values.email },
    });
  };

  const formik = useFormik<{ email: string }>({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: onSubmit,
    enableReinitialize: true,
  });

  const handleCancel = () => {
    navigate(ROUTES.CHOOSE_ROLE);
  };

  return {
    formik,
    loading: isRequestPasswordResetLoading,
    handleCancel,
  };
};
