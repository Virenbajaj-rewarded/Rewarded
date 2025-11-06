import { PaymentRequests } from '@/components/payment/PaymentRequests';

const Expenses = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
        <p className="text-muted-foreground mt-2">
          Track your expenses and spending.
        </p>
      </div>
      <PaymentRequests />
    </div>
  );
};

export default Expenses;
