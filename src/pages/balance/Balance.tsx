import { BalanceCards } from '@/components/balance/BalanceCards';

const Balance = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Balance</h1>
        <p className="text-muted-foreground mt-2">
          View your current balance and transactions.
        </p>
      </div>
      <BalanceCards />
    </div>
  );
};

export default Balance;
