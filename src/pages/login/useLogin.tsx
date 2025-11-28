import { LoginForm } from './Login.types';
import { loginValidationSchema } from './Login.validation';
import { useFormik } from 'formik';
import { useAuth } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/routes';

export const useLogin = () => {
  const navigate = useNavigate();
  const {
    login,
    isLoginLoading,
    signInWithGoogle,
    isSignInWithGoogleLoading,
    healthCheck,
  } = useAuth();

  const onLogin = async (values: LoginForm) => {
    const success = await login(values);
    if (success) {
      toast.success('Welcome back!');
      navigate(ROUTES.ROOT);
    } else {
      toast.error('Invalid email or password');
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

  const handleSignInWithGoogle = async () => {
    await healthCheck()
      .then(async () => {
        try {
          await signInWithGoogle();
          toast.success('Welcome back!');
          navigate(ROUTES.ROOT);
        } catch (e) {
          const error = e as Error;
          toast.error(error?.message || 'Error. Please try again later.');
        }
      })
      .catch(error => {
        toast.error('Please try again later.');
        throw error;
      });
  };

  return {
    formik,
    loading: isLoginLoading,
    handleSignInWithGoogle,
    isSignInWithGoogleLoading,
  };
};
