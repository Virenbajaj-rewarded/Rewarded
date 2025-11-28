import { useFormik } from 'formik';
import { userValidationSchema } from './SignupUser.validation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth';
import { IUserSignupFormValues } from './SignupUser.types';
import { ROUTES } from '@/routes';
import { getFirebaseErrorMessage } from '@/services/auth/authService';

const initialValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
};

export const useSignupUser = () => {
  const { signupUser, isSignupUserLoading, healthCheck } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: IUserSignupFormValues) => {
    healthCheck()
      .then(async () => {
        try {
          const response = await signupUser(values);
          if (!response.isEmailConfirmed) {
            navigate(ROUTES.CONFIRM_EMAIL, {
              state: { email: response.email },
            });
          } else {
            toast.success('Account created successfully!');
            navigate(ROUTES.ROOT);
          }
        } catch (error) {
          const errorMessage = getFirebaseErrorMessage(error);
          toast.error(errorMessage);
        }
      })
      .catch(error => {
        throw error;
      });
  };

  const formik = useFormik<IUserSignupFormValues>({
    initialValues,
    validationSchema: userValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return { formik, isLoading: isSignupUserLoading };
};
