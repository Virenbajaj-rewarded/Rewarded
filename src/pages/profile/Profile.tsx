import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from './useProfile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Profile = () => {
  const {
    formik,
    isLoading,
    isPending,
    isError,
    navigateToChangePassword,
    handleDeleteAccount,
    isModalVisible,
    showModal,
    hideModal,
  } = useProfile();
  const { logout } = useAuth();
  console.log('formik', formik);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-2">
                Manage your profile information
              </p>
            </div>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="max-w-2xl gap-4 flex flex-col"
          >
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.phone && formik.errors.phone}
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
            {formik.dirty && (
              <div className="flex justify-end items-center gap-3">
                <Button variant="outline" onClick={() => formik.resetForm()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formik.isValid}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
          {!formik.dirty && (
            <div className="flex flex-col gap-3 justify-between items-center">
              <Button
                variant="link"
                onClick={navigateToChangePassword}
                className="flex items-center gap-2 "
              >
                Change Password
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>

              <Button
                variant="outline"
                onClick={showModal}
                className="flex items-center gap-2 text-destructive"
              >
                Delete Account
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
      <Dialog open={isModalVisible} onOpenChange={hideModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              if you delete your account now you will lose all your progress at
              all programs?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={hideModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
