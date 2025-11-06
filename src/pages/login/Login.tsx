import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormikProvider } from 'formik';
import { useLogin } from './useLogin';
import { ROUTES } from '@/routes';
import StarIcon from '@/assets/star.svg?react';

const Login = () => {
  const { formik, loading } = useLogin();

  return (
    <FormikProvider value={formik}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <StarIcon width={48} height={48} />
            </div>
            <CardTitle className="text-[38px] text-white">
              Welcome back
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.password && formik.errors.password}
                />
              </div>
              <div className="mt-4 text-sm">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!(formik.isValid && formik.dirty)}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6  text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{' '}
              </span>
              <Link
                to={ROUTES.SIGNUP_CHOOSE_ROLE}
                className="text-primary hover:text-primary/80"
              >
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormikProvider>
  );
};

export default Login;
