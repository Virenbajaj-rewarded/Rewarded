import { useAuth } from '@/services/auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { IUserSignupFormValues } from './SignupUser.types';
import { useFormik } from 'formik';
import { userValidationSchema } from './SignupUser.validation';
import { showToast } from '@/utils';
import { ERole } from '@/enums';

const initialValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
};

export const useSignupUser = () => {
  const navigation = useNavigation();
  const { signupUser, signupUserLoading, healthCheck } = useAuth();
  const handleSubmit = async (values: IUserSignupFormValues) => {
    await healthCheck()
      .then(async () => {
        const response = await signupUser(values);
        if (!response.isEmailConfirmed) {
          navigation.navigate(Paths.CONFIRM_EMAIL, { email: values.email });
        } else {
          navigation.navigate(Paths.LOGIN, { role: ERole.USER });
        }
      })
      .catch(error => {
        showToast({
          type: 'error',
          text1: 'Please try again later',
        });
        throw error;
      });
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
