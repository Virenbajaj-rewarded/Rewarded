import { useSetPassword } from './useSetPassword';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ErrorIcon from '@/assets/error.svg?react';

const SetPassword = () => {
  const {
    formik,
    onboardMerchantError,
    isSetMerchantPasswordLoading,
    handleNavigateToSignup,
  } = useSetPassword();

  if (onboardMerchantError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-[40px] flex flex-col justify-center items-center gap-4">
          <ErrorIcon width={48} height={48} />
          <CardTitle className="text-[30px] text-center">
            The Link Has Expired
          </CardTitle>
          <CardDescription className="text-[14px] text-[#BFBFBF]">
            Please complete the sign up information to proceed.
          </CardDescription>
          <Button
            type="button"
            className="w-full"
            onClick={handleNavigateToSignup}
          >
            Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-[40px]">
        <CardTitle className="text-[30px] text-white mb-5">
          Verification Successful
        </CardTitle>

        <CardDescription className="text-[14px] text-[#BFBFBF] mb-5">
          Your account is verified. Create a password to continue with your
          program setup.{' '}
        </CardDescription>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password && (formik.errors.password as string)
            }
            className="mb-4"
          />
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              (formik.errors.confirmPassword as string)
            }
          />
          <Button type="submit" disabled={!formik.isValid} className="w-full">
            {isSetMerchantPasswordLoading
              ? 'Setting Password...'
              : 'Set Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SetPassword;
