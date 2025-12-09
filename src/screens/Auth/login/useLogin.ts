import { useAuth } from '@/services/auth/useAuth';
import { LoginForm } from './Login.types';
import { Paths } from '@/navigation/paths';
import { useNavigation } from '@react-navigation/native';
import { loginValidationSchema } from './Login.validation';
import { useFormik } from 'formik';
import { ERole } from '@/enums';

export const useLogin = (chosenRole: ERole) => {
  const navigation = useNavigation();
  const { login, loginLoading, signInWithGoogle, signInWithGoogleLoading, healthCheck } = useAuth();

  const onLogin = async (values: LoginForm) => {
    try {
      await login(values);
    } catch (error) {
      console.error(error);
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

  const navigateToSignup = () => {
    navigation.navigate(chosenRole === ERole.USER ? Paths.SIGNUP_USER : Paths.SIGNUP_MERCHANT);
  };

  const navigateToForgotPassword = () => {
    navigation.navigate(Paths.FORGOT_PASSWORD);
  };

  const handleSignInWithGoogle = async () => {
    try {
      await healthCheck();
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    formik,
    loading: loginLoading,
    navigateToSignup,
    navigateToForgotPassword,
    signInWithGoogleLoading,
    handleSignInWithGoogle,
  };
};
