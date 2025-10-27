import { DashboardLayout } from '@/components/layout/DashboardLayout';

const ChangePassword = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Change Password
            </h1>
            <p className="text-muted-foreground mt-2">
              Change your password to secure your account
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
