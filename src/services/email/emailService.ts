import { instance } from '@/services/instance';

export const sendEmailVerificationCode = async (): Promise<{
  success: boolean;
}> => {
  try {
    const sendEmailVerificationCodeResponse = await instance.post<{
      success: boolean;
    }>('email/send');

    return sendEmailVerificationCodeResponse.json();
  } catch (error) {
    console.error('sendEmailVerificationCode error', error);
    throw error;
  }
};

export const resendEmailVerificationCode = async (): Promise<{
  success: boolean;
}> => {
  const resendEmailVerificationCodeResponse = await instance.post<{
    success: boolean;
  }>('email/resend');
  return resendEmailVerificationCodeResponse.json();
};

export const confirmEmail = async (code: string): Promise<{ success: boolean }> => {
  const confirmEmailResponse = await instance.post<{ success: boolean }>('email/verify', {
    json: {
      code,
    },
  });

  return confirmEmailResponse.json();
};
