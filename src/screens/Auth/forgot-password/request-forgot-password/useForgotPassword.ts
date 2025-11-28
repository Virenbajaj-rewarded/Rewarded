import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/services/auth/useAuth';
import { forgotPasswordValidationSchema } from './ForgotPassword.validation';
import { Paths } from '@/navigation/paths';

export interface ForgotPasswordForm {
  email: string;
}

export const useForgotPassword = () => {
  const navigation = useNavigation();
  const { requestPasswordReset, requestPasswordResetLoading } = useAuth();

  const handleSubmit = async (values: ForgotPasswordForm) => {
    try {
      await requestPasswordReset(values.email);
      navigation.navigate(Paths.CONFIRM_FORGOT_PASSWORD, { email: values.email });
    } catch (error) {
      console.error('Failed to request password reset:', error);
    }
  };

  const formik = useFormik<ForgotPasswordForm>({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const handleCancel = () => {
    navigation.goBack();
  };

  return {
    formik,
    loading: requestPasswordResetLoading,
    handleCancel,
  };
};
