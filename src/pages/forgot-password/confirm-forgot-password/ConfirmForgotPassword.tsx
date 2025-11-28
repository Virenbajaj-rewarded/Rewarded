import { Link } from 'react-router-dom';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useConfirmForgotPassword } from './useConfirmForgotPassword';
import { Button } from '@/components/ui/button';
import RequestIcon from '@/assets/request.svg?react';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import { ROUTES } from '@/routes';
import { FormikProvider } from 'formik';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const ConfirmForgotPassword = () => {
  const { formik, timeLeft, canResend, handleResendCode, email, isLoading } =
    useConfirmForgotPassword();

  return (
    <FormikProvider value={formik}>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-[40px]">
          <div className="flex items-center gap-2 mb-4">
            <Link to={ROUTES.FORGOT_PASSWORD}>
              <ArrowLeftIcon width={24} height={24} />
            </Link>
            <CardTitle className="text-[30px] font-bold">
              Check Your Email
            </CardTitle>
          </div>
          <CardDescription className="text-[14px] font-normal text-[#BFBFBF] mb-10">
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
            disabled={!(formik.isValid && formik.dirty) || isLoading}
            className="mt-10 w-full"
          >
            {isLoading ? 'Loading...' : 'Change Password'}
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

          <div className="mt-4 text-center">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-primary hover:text-primary/80 text-sm"
            >
              Change Email
            </Link>
          </div>
        </Card>
      </div>
    </FormikProvider>
  );
};

export default ConfirmForgotPassword;
