import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useConfirmEmail } from './useConfirmEmail';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RequestIcon from '@/assets/request.svg?react';
import StarIcon from '@/assets/star.svg?react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const ConfirmEmail = () => {
  const location = useLocation();
  const email = location.state?.email;
  const {
    formik,
    timeLeft,
    canResend,
    handleResendCode,
    sendEmailVerificationCodeLoading,
  } = useConfirmEmail();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-[40px]">
        <StarIcon width={32} height={32} className="justify-self-center mb-5" />
        <CardTitle className="text-[24px] text-center text-white mb-3">
          Check Your Email
        </CardTitle>
        <CardDescription className="text-[14px] font-normal text-[#BFBFBF] text-center mb-10">
          {email ? (
            <>
              We've sent you a 6-digit code to{' '}
              <span className="text-white font-bold">{email}</span>. To verify
              your account, please enter the code below.
            </>
          ) : (
            <>
              We've sent you a 6-digit code to your email. To verify your
              account, please enter the code below.
            </>
          )}
        </CardDescription>
        <div className="mt-2 flex justify-center">
          <InputOTP
            id="code"
            name="code"
            maxLength={6}
            value={formik.values.code}
            onChange={value => formik.setFieldValue('code', value)}
            onBlur={formik.handleBlur}
            containerClassName="gap-3"
          >
            <InputOTPGroup className="gap-[8px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-[48px] w-[48px] bg-[#1F1F1F] rounded-[8px] text-[16px] font-semibold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {formik.touched.code && formik.errors.code && (
          <p className="text-destructive text-sm mt-1">
            {typeof formik.errors.code === 'string' ? formik.errors.code : ''}
          </p>
        )}
        <Button
          type="submit"
          onClick={() => formik.handleSubmit()}
          disabled={!(formik.isValid && formik.dirty)}
          className="mt-10 w-full"
        >
          {sendEmailVerificationCodeLoading ? 'Confirming...' : 'Confirm Code'}
        </Button>

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleResendCode}
            className="w-full"
            disabled={!canResend}
          >
            <RequestIcon />
            {canResend ? 'Resend Code' : `Resend in ${timeLeft}s`}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
