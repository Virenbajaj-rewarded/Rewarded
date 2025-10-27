import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BusinessProfileForm } from '@/components/business-profile/BusinessProfileForm';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const BusinessProfile = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Business Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your business information and settings
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <BusinessProfileForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessProfile;
