import { LoginForm } from './Login.types';
import { loginValidationSchema } from './Login.validation';
import { useFormik } from 'formik';
import { useAuth } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/routes';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login, isLoginLoading } = useAuth();

  const onLogin = async (values: LoginForm) => {
    try {
      const success = await login(values);
      if (success) {
        toast.success('Welcome back!');
        navigate(ROUTES.ROOT);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const formik = useFormik<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: onLogin,
    enableReinitialize: true,
  });

  return {
    formik,
    loading: isLoginLoading,
  };
};
