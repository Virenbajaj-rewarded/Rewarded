import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { useSetNewPassword } from './useSetNewPassword';
import { FormikProvider } from 'formik';

const SetNewPassword = () => {
  const { formik, isResetPasswordLoading } = useSetNewPassword();

  return (
    <FormikProvider value={formik}>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-[40px]">
          <CardHeader className="p-0 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <CardTitle className="text-[30px] font-bold">
                Set New Password
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <PasswordInput
                id="newPassword"
                label="New Password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="new-password"
                error={
                  formik.touched.newPassword
                    ? (formik.errors.newPassword as string | undefined)
                    : undefined
                }
                placeholder="Enter your new password"
                className="px-4"
              />
              <PasswordInput
                id="confirmPassword"
                label="Confirm New Password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword
                    ? (formik.errors.confirmPassword as string | undefined)
                    : undefined
                }
                placeholder="Confirm your new password"
                className="px-4"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={
                    !formik.isValid || !formik.dirty || isResetPasswordLoading
                  }
                  className="w-full sm:w-auto flex-1"
                >
                  {isResetPasswordLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormikProvider>
  );
};

export default SetNewPassword;
