import { useMutation } from '@tanstack/react-query';
import {
  sendEmailVerificationCode,
  resendEmailVerificationCode,
  confirmEmail,
} from './emailService';
import { toast } from 'sonner';

export const useEmailConfirmation = () => {
  const sendEmailVerificationCodeMutation = useMutation({
    mutationFn: async () => {
      return await sendEmailVerificationCode();
    },
    onSuccess: () => {
      toast.success('Email verification code sent successfully!');
    },
  });

  const resendEmailVerificationCodeMutation = useMutation({
    mutationFn: async () => {
      return await resendEmailVerificationCode();
    },
    onSuccess: () => {
      toast.success('Email verification code resent successfully!');
    },
  });

  const confirmEmailMutation = useMutation({
    mutationFn: async (code: string) => {
      return await confirmEmail(code);
    },
    onSuccess: () => {
      toast.success('Email confirmed successfully!');
    },
  });

  return {
    sendEmailVerificationCode: sendEmailVerificationCodeMutation.mutateAsync,
    resendEmailVerificationCode:
      resendEmailVerificationCodeMutation.mutateAsync,
    confirmEmail: confirmEmailMutation.mutateAsync,
    sendEmailVerificationCodeError: sendEmailVerificationCodeMutation.error,
    resendEmailVerificationCodeError: resendEmailVerificationCodeMutation.error,
    confirmEmailError: confirmEmailMutation.error,
    sendEmailVerificationCodeSuccess:
      sendEmailVerificationCodeMutation.isSuccess,
    resendEmailVerificationCodeSuccess:
      resendEmailVerificationCodeMutation.isSuccess,
    confirmEmailSuccess: confirmEmailMutation.isSuccess,
    sendEmailVerificationCodeLoading:
      sendEmailVerificationCodeMutation.isPending,
    resendEmailVerificationCodeLoading:
      resendEmailVerificationCodeMutation.isPending,
    confirmEmailLoading: confirmEmailMutation.isPending,
  };
};
