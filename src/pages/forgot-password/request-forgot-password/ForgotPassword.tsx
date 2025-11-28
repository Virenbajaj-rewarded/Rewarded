import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FormikProvider } from 'formik';
import { useForgotPassword } from './useForgotPassword';
import { ROUTES } from '@/routes';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';

const ForgotPassword = () => {
  const { formik, loading, handleCancel } = useForgotPassword();

  return (
    <FormikProvider value={formik}>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-[40px]">
          <CardHeader className="p-0 mb-7">
            <div className="flex items-center gap-2 mb-4">
              <Link to={ROUTES.CHOOSE_ROLE}>
                <ArrowLeftIcon width={24} height={24} />
              </Link>
              <CardTitle className="text-[30px] font-bold">
                Forgot Password?
              </CardTitle>
            </div>
            <CardDescription className="text-[14px] text-[#BFBFBF]">
              Enter your email, and we'll send you a verification link.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.email && formik.errors.email}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!(formik.isValid && formik.dirty) || loading}
              >
                {loading ? 'Sending...' : 'Send Link'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormikProvider>
  );
};

export default ForgotPassword;
