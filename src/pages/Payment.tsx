import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PaymentRequests } from "@/components/payment/PaymentRequests";

const Payment = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Request Payment</h1>
          <p className="text-muted-foreground mt-2">
            Request USDC payouts and manage settlement
          </p>
        </div>
        
        <PaymentRequests />
      </div>
    </DashboardLayout>
  );
};

export default Payment;