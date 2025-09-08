import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BalanceCards } from "@/components/balance/BalanceCards";

const Balances = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Balances</h1>
          <p className="text-muted-foreground mt-2">
            Manage your USD and USDC balances
          </p>
        </div>
        
        <BalanceCards />
      </div>
    </DashboardLayout>
  );
};

export default Balances;