import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSignupUser } from './useSignupUser';
import { FormikProvider } from 'formik';
import { ROUTES } from '@/routes';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import { ERole } from '@/enums';

const SignupUser = () => {
  const { formik, isLoading } = useSignupUser();
  return (
    <FormikProvider value={formik}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-7">
          <CardHeader className="text-center p-0">
            <div className="flex items-center gap-2 mb-4">
              <Link to={`${ROUTES.LOGIN}?role=${ERole.USER}`}>
                <ArrowLeftIcon width={24} height={24} />
              </Link>
              <CardTitle className="text-3xl font-bold">
                Create Your Account
              </CardTitle>
            </div>

            <CardDescription className="text-[14px] text-[#BFBFBF] text-left">
              Enter your details to start
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-7">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.fullName && formik.errors.fullName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.email && formik.errors.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && formik.errors.password}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agreedToTerms"
                    checked={formik.values.agreedToTerms}
                    onCheckedChange={checked => {
                      formik.setFieldValue('agreedToTerms', checked);
                      formik.setFieldTouched('agreedToTerms', true, false);
                    }}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="agreedToTerms"
                    className="text-sm font-normal leading-relaxed cursor-pointer"
                  >
                    By signing up, you agree to our{' '}
                    <Link
                      to="/terms-and-conditions"
                      className="text-primary hover:text-primary/80 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms and Conditions
                    </Link>
                    . Please read the full Terms and Conditions before
                    completing registration.
                  </Label>
                </div>
                {formik.touched.agreedToTerms &&
                  formik.errors.agreedToTerms && (
                    <p className="text-sm text-[#F5222D]">
                      {formik.errors.agreedToTerms}
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!(formik.isValid && formik.dirty)}
              >
                {isLoading ? 'Loading...' : 'Next'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormikProvider>
  );
};

export default SignupUser;
