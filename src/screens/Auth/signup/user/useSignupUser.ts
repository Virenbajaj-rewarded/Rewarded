import { useAuth } from '@/services/auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { IUserSignupFormValues } from './SignupUser.types';
import { useFormik } from 'formik';
import { userValidationSchema } from './SignupUser.validation';
const initialValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

export const useSignupUser = () => {
  const navigation = useNavigation();
  const { signupUser, signupUserLoading } = useAuth();
  const handleSubmit = async (values: IUserSignupFormValues) => {
    try {
      const response = await signupUser(values);
      if (!response.isEmailConfirmed) {
        navigation.navigate(Paths.CONFIRM_EMAIL, { email: values.email });
      } else {
        navigation.navigate(Paths.LOGIN);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik<IUserSignupFormValues>({
    initialValues,
    validationSchema: userValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return {
    formik,
    signupUserLoading,
  };
};
