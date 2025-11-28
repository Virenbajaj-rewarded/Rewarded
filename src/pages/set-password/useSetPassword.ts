import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { setPasswordValidationSchema } from './SetPassword.validation';
import { useAuth } from '@/services/auth';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export const useSetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
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
      setBusinessName(response.businessName);
    },
    [onboardMerchant, setEmail, setBusinessName]
  );

  useEffect(() => {
    if (token) {
      handleOnboardMerchant(token);
    }
  }, [token, handleOnboardMerchant]);

  const handleSubmit = async values => {
    await setMerchantPassword({ password: values.password, email }).then(() => {
      setIsSuccess(true);
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

  const handleNavigateToHome = () => {
    navigate(ROUTES.CHOOSE_ROLE);
  };

  const handleNavigateToDashboard = () => {
    navigate(ROUTES.PROGRAMS_ACTIVE);
  };

  const handleNavigateToCreateProgram = () => {
    navigate(ROUTES.CREATE_PROGRAM);
  };

  return {
    formik,
    onboardMerchantError,
    isSetMerchantPasswordLoading,
    handleNavigateToSignup,
    handleNavigateToHome,
    businessName,
    isSuccess,
    handleNavigateToDashboard,
    handleNavigateToCreateProgram,
  };
};
