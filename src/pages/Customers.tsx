import { CustomerAnalytics } from '@/components/customers/CustomerAnalytics';

const Customers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Customer Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Track customer engagement and rewards activity
        </p>
      </div>

      <CustomerAnalytics />
    </div>
  );
};

export default Customers;
