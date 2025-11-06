import { api } from '@/lib/api';

export const sendEmailVerificationCode = async (): Promise<{
  success: boolean;
}> => {
  const sendEmailVerificationCodeResponse = await api.post<{
    success: boolean;
  }>('/email/send');
  return sendEmailVerificationCodeResponse.data;
};

export const resendEmailVerificationCode = async (): Promise<{
  success: boolean;
}> => {
  const resendEmailVerificationCodeResponse = await api.post<{
    success: boolean;
  }>('/email/resend');

  return resendEmailVerificationCodeResponse.data;
};

export const confirmEmail = async (
  code: string
): Promise<{ success: boolean }> => {
  const confirmEmailResponse = await api.post<{ success: boolean }>(
    'email/verify',
    {
      code,
    }
  );

  return confirmEmailResponse.data;
};
