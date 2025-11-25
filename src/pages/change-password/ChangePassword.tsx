import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import { useChangePassword } from './useChangePassword';

const ChangePassword = () => {
  const { formik, isChangePasswordLoading, handleGoBack, handleCancel } =
    useChangePassword();

  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center px-4">
      <Card className="w-full max-w-[480px] p-8 md:p-10">
        <CardHeader className="p-0 mb-5">
          <div className="flex lg:items-center gap-4 mb-4 flex-col sm:flex-row">
            <button
              type="button"
              onClick={handleGoBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F1F1F]"
              aria-label="Go back to profile"
            >
              <ArrowLeftIcon width={20} height={20} />
            </button>
            <CardTitle className="lg:text-[30px] sm:text-[16px] text-white">
              Change Password
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <PasswordInput
              id="oldPassword"
              label="Current Password"
              name="oldPassword"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="current-password"
              error={
                formik.touched.oldPassword
                  ? (formik.errors.oldPassword as string | undefined)
                  : undefined
              }
              placeholder="Enter your current password"
              className="px-4"
            />
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
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !formik.isValid || !formik.dirty || isChangePasswordLoading
                }
                className="w-full sm:w-auto flex-1"
              >
                {isChangePasswordLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
