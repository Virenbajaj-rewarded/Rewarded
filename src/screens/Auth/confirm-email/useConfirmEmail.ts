import { useCallback, useEffect, useState } from 'react';
import { confirmCodeValidationSchema } from './ConfirmEmail.validation';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { useEmailConfirmation } from '@/services/email/useEmailConfirmation';

export const useConfirmEmail = () => {
  const navigation = useNavigation();
  const {
    sendEmailVerificationCode,
    resendEmailVerificationCode,
    confirmEmail,
    confirmEmailLoading,
  } = useEmailConfirmation();

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleConfirmEmail = async (values: { code: string }) => {
    try {
      await confirmEmail(values.code);
      navigation.navigate(Paths.LOGIN);
    } catch (error) {
      console.error('Failed to confirm email:', error);
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

  const handleSendCode = useCallback(async () => {
    try {
      await sendEmailVerificationCode();
    } catch (error) {
      console.error('Failed to send code:', error);
    }
  }, [sendEmailVerificationCode]);

  useEffect(() => {
    handleSendCode();
  }, [handleSendCode]);

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
    confirmEmailLoading,
  };
};
