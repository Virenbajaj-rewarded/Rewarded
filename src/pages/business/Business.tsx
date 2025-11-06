import { BusinessProfileForm } from '@/components/business-profile/BusinessProfileForm';

const Business = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your business information.
        </p>
      </div>
      <div className="max-w-2xl">
        <BusinessProfileForm />
      </div>
    </div>
  );
};

export default Business;
