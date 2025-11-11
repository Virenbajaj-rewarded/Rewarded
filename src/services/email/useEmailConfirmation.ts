import { useMutation } from '@tanstack/react-query';
import {
  sendEmailVerificationCode,
  resendEmailVerificationCode,
  confirmEmail,
} from './emailService';

export const useEmailConfirmation = () => {
  const sendEmailVerificationCodeMutation = useMutation({
    mutationFn: async () => {
      return await sendEmailVerificationCode();
    },
    onSuccess: () => {
      console.log('Email verification code sent successfully!');
    },
    onError: error => {
      console.error('Failed to send email verification code:', error);
    },
  });

  const resendEmailVerificationCodeMutation = useMutation({
    mutationFn: async () => {
      return await resendEmailVerificationCode();
    },
    onSuccess: () => {
      console.log('Email verification code resent successfully!');
    },
    onError: error => {
      console.error('Failed to resend email verification code:', error);
    },
  });

  const confirmEmailMutation = useMutation({
    mutationFn: async (code: string) => {
      return await confirmEmail(code);
    },
    onSuccess: () => {
      console.log('Email confirmed successfully!');
    },
    onError: error => {
      console.error('Failed to confirm email:', error);
    },
  });

  return {
    sendEmailVerificationCode: sendEmailVerificationCodeMutation.mutateAsync,
    resendEmailVerificationCode: resendEmailVerificationCodeMutation.mutateAsync,
    confirmEmail: confirmEmailMutation.mutateAsync,
    sendEmailVerificationCodeError: sendEmailVerificationCodeMutation.error,
    resendEmailVerificationCodeError: resendEmailVerificationCodeMutation.error,
    confirmEmailError: confirmEmailMutation.error,
    sendEmailVerificationCodeSuccess: sendEmailVerificationCodeMutation.isSuccess,
    resendEmailVerificationCodeSuccess: resendEmailVerificationCodeMutation.isSuccess,
    confirmEmailSuccess: confirmEmailMutation.isSuccess,
    sendEmailVerificationCodeLoading: sendEmailVerificationCodeMutation.isPending,
    resendEmailVerificationCodeLoading: resendEmailVerificationCodeMutation.isPending,
    confirmEmailLoading: confirmEmailMutation.isPending,
  };
};
