import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BusinessProfileForm } from "@/components/profile/BusinessProfileForm";

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Business Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your business information and settings
          </p>
        </div>
        
        <div className="max-w-2xl">
          <BusinessProfileForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;