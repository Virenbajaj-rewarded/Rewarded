import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { setPasswordValidationSchema } from './SetPassword.validation';
import { useAuth } from '@/services/auth';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export const useSetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    onboardMerchant,
    onboardMerchantError,
    setMerchantPassword,
    isSetMerchantPasswordLoading,
  } = useAuth();

  const handleOnboardMerchant = useCallback(
    async (onboardToken: string) => {
      const response = await onboardMerchant(onboardToken);
      setEmail(response.email);
    },
    [onboardMerchant, setEmail]
  );

  useEffect(() => {
    if (token) {
      handleOnboardMerchant(token);
    }
  }, [token, handleOnboardMerchant]);

  const handleSubmit = async values => {
    await setMerchantPassword({ password: values.password, email })
      .then(() => {
        toast.success('Password set successfully!');
        navigate(ROUTES.LOGIN);
      })
      .catch(() => {
        toast.error('Failed to set password!');
      });
  };
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: setPasswordValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const handleNavigateToSignup = () => {
    navigate(ROUTES.SIGNUP_MERCHANT);
  };
  return {
    formik,
    onboardMerchantError,
    isSetMerchantPasswordLoading,
    handleNavigateToSignup,
  };
};
