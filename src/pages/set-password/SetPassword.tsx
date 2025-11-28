import { useSetPassword } from './useSetPassword';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ErrorIcon from '@/assets/error.svg?react';
import CheckIcon from '@/assets/check-success.svg?react';
const SetPassword = () => {
  const {
    formik,
    onboardMerchantError,
    isSetMerchantPasswordLoading,
    handleNavigateToSignup,
    handleNavigateToHome,
    businessName,
    isSuccess,
    handleNavigateToDashboard,
    handleNavigateToCreateProgram,
  } = useSetPassword();

  if (onboardMerchantError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-7 flex flex-col justify-center items-center gap-4">
          <ErrorIcon width={48} height={48} />
          <CardTitle className="text-3xl text-center">
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-[40px]">
          <CardHeader className="text-center p-0 flex flex-col items-center gap-[8px]">
            <CheckIcon width={70} height={70} />

            <CardTitle className="text-2xl text-white">
              Registration Successful
            </CardTitle>
            <CardDescription className="text-[14px] text-[#BFBFBF] text-center">
              Set up your rewards program & payment system today
            </CardDescription>

            <div className="w-full flex gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-none bg-[#0C1A31]"
                onClick={handleNavigateToDashboard}
              >
                Go to Dashboard
              </Button>
              <Button
                type="button"
                variant="default"
                className="flex-1"
                onClick={handleNavigateToCreateProgram}
              >
                Create Program
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-7">
        <CardTitle className="text-3xl text-white mb-5">
          Verification Successful
        </CardTitle>

        <CardDescription className="text-[14px] text-[#BFBFBF] mb-5">
          Your account for {businessName || 'your business'} is verified. Create
          a password to continue with your program setup.{' '}
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
              ? 'Loading...'
              : 'Complete Registration'}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full text-primary hover:text-primary/80"
            onClick={handleNavigateToHome}
          >
            Cancel
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SetPassword;
