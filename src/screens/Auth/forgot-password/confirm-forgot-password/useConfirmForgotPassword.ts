import { useEffect, useState } from 'react';
import { confirmCodeValidationSchema } from './ConfirmForgotPassword.validation';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { useAuth } from '@/services/auth/useAuth';

export const useConfirmForgotEmailPassword = (email: string) => {
  const navigation = useNavigation();
  const {
    verifyPasswordResetCode,
    verifyPasswordResetCodeLoading,
    requestPasswordReset,
    requestPasswordResetLoading,
  } = useAuth();

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleConfirmEmail = async (values: { code: string }) => {
    const code = values.code.toString();
    try {
      await verifyPasswordResetCode({ email, code });
      navigation.navigate(Paths.SET_NEW_PASSWORD, { email, code });
    } catch (error) {
      console.error('Failed to confirm email:', error);
    }
  };

  const handleResendCode = async () => {
    try {
      await requestPasswordReset(email);
    } catch (error) {
      console.error('Failed to resend code:', error);
    } finally {
      setTimeLeft(60);
      setCanResend(false);
    }
  };

  const handleChangeEmail = () => {
    navigation.goBack();
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
    requestPasswordResetLoading,
    verifyPasswordResetCodeLoading,
    handleChangeEmail,
  };
};
