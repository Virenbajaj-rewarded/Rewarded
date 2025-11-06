import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from './useProfile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

const Profile = () => {
  const {
    formik,
    isPending,
    navigateToChangePassword,
    handleDeleteAccount,
    isDeleteAccountModalVisible,
    showDeleteAccountModal,
    hideDeleteAccountModal,
    handleLogout,
    isLogoutModalVisible,
    showLogoutModal,
    hideLogoutModal,
  } = useProfile();

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <h1 className="text-[38px] font-bold text-foreground">Profile</h1>
          <div className="hidden lg:flex flex-row gap-[16px]">
            <Button
              variant="outline"
              onClick={navigateToChangePassword}
              className="flex items-center justify-center gap-2 border-[none] bg-[#0C1A31] text-[#639CF8] w-[160px]"
            >
              Change Password
            </Button>

            <Button
              variant="outline"
              onClick={showLogoutModal}
              className="flex items-center justify-center gap-2 w-[160px]"
            >
              Log Out
            </Button>

            <Button
              variant="outline"
              onClick={showDeleteAccountModal}
              className="flex items-center justify-center gap-2 text-destructive border-destructive w-[160px]"
            >
              Delete Account
            </Button>
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-xl mx-auto lg:mx-0 gap-4 flex flex-col"
        >
          <Card className="flex flex-col p-6 md:p-[40px] gap-[16px]">
            <Input
              label="Full Name"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              error={formik.touched.fullName && formik.errors.fullName}
            />

            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              disabled
              error={formik.touched.phone && formik.errors.phone}
            />
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              disabled
              error={formik.touched.email && formik.errors.email}
            />
            {formik.dirty && (
              <div className="flex items-center gap-[16px]">
                <Button
                  variant="outline"
                  onClick={() => formik.resetForm()}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formik.isValid}
                  className="w-full"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </Card>
        </form>
        <div className="lg:hidden flex flex-col sm:flex-row gap-[16px] justify-center">
          <Button
            variant="outline"
            onClick={navigateToChangePassword}
            className="flex items-center justify-center gap-2 border-[none] bg-[#0C1A31] text-[#639CF8] w-full sm:w-[160px]"
          >
            Change Password
          </Button>

          <Button
            variant="outline"
            onClick={showLogoutModal}
            className="flex items-center justify-center gap-2 w-full sm:w-[160px]"
          >
            Log Out
          </Button>

          <Button
            variant="outline"
            onClick={showDeleteAccountModal}
            className="flex items-center justify-center gap-2 text-destructive border-destructive w-full sm:w-[160px]"
          >
            Delete Account
          </Button>
        </div>
      </div>
      <Dialog
        open={isDeleteAccountModalVisible}
        onOpenChange={hideDeleteAccountModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              If you delete your account now you will lose all your progress at
              all programs?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={hideDeleteAccountModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isLogoutModalVisible} onOpenChange={hideLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out?</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={hideLogoutModal}>
              Cancel
            </Button>
            <Button onClick={handleLogout}>Log Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
