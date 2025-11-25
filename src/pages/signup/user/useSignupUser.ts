import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { userValidationSchema } from './SignupUser.validation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth';
import { IUserSignupFormValues } from './SignupUser.types';
import { ROUTES } from '@/routes';

const initialValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
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
          toast.error('An error occurred. Please try again.');
        }
      })
      .catch(error => {
        toast.error('An error occurred. Please try again.');
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
