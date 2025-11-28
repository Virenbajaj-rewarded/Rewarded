import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { useAuth } from '@/services/auth';
import { setNewPasswordValidationSchema } from './SetNewPassword.validation';
import { SetNewPasswordFormValues } from './SetNewPassword.types';
import { toast } from 'sonner';
import { ERole } from '@/enums';

export const useSetNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email as string | undefined;
  const code = location.state?.code as string | undefined;
  const { resetPassword, isResetPasswordLoading } = useAuth();

  const handleSubmit = async (values: SetNewPasswordFormValues) => {
    if (!email || !code) {
      toast.error('Email and code are required');
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }

    await resetPassword({ email, code, newPassword: values.newPassword });
    navigate(ROUTES.CHOOSE_ROLE);
  };

  const formik = useFormik<SetNewPasswordFormValues>({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: setNewPasswordValidationSchema,
    onSubmit: handleSubmit,
  });

  return {
    formik,
    isResetPasswordLoading,
  };
};
