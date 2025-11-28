import { useEffect, useState } from 'react';
import { confirmForgotPasswordValidationSchema } from './ConfirmForgotPassword.validation';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { useAuth } from '@/services/auth';

export const useConfirmForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email as string | undefined;
  const {
    verifyPasswordResetCode,
    isVerifyPasswordResetCodeLoading,
    requestPasswordReset,
    isRequestPasswordResetLoading,
  } = useAuth();

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleConfirmCode = async (values: { code: string }) => {
    if (!email) {
      toast.error('Email is required');
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }
    await verifyPasswordResetCode({ email, code: values.code });
    navigate(ROUTES.SET_NEW_PASSWORD, {
      state: { email, code: values.code },
    });
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email is required');
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }

    await requestPasswordReset(email);
    setTimeLeft(60);
    setCanResend(false);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: confirmForgotPasswordValidationSchema,
    onSubmit: handleConfirmCode,
    enableReinitialize: true,
  });

  return {
    formik,
    timeLeft,
    canResend,
    handleResendCode,
    email,
    isLoading:
      isVerifyPasswordResetCodeLoading || isRequestPasswordResetLoading,
  };
};
