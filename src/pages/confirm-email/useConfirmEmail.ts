import { useEffect, useState } from 'react';
import { useEmailConfirmation } from '@/services/email';
import { confirmCodeValidationSchema } from './ConfirmEmail.validation';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export const useConfirmEmail = () => {
  const navigate = useNavigate();
  const {
    sendEmailVerificationCode,
    sendEmailVerificationCodeLoading,
    resendEmailVerificationCode,
    confirmEmail,
  } = useEmailConfirmation();

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleConfirmEmail = async values => {
    try {
      await confirmEmail(values.code);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Failed to confirm email:', error);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendEmailVerificationCode();
    } catch (error) {
      console.error('Failed to resend code:', error);
    } finally {
      setTimeLeft(60);
      setCanResend(false);
    }
  };

  useEffect(() => {
    sendEmailVerificationCode();
  }, [sendEmailVerificationCode]);

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
    validationSchema: confirmCodeValidationSchema,
    onSubmit: handleConfirmEmail,
    enableReinitialize: true,
  });

  return {
    handleConfirmEmail,
    formik,
    timeLeft,
    canResend,
    handleResendCode,
    sendEmailVerificationCodeLoading,
  };
};
