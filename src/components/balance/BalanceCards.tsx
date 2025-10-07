import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Wallet } from 'lucide-react';

const balances = [
  {
    title: 'USD Balance',
    amount: '$0.00',
    icon: DollarSign,
    actions: ['TOP UP', 'CASH OUT'],
  },
  {
    title: 'USDC Balance',
    amount: '$0.00',
    icon: Wallet,
    actions: ['TOP UP', 'CASH OUT'],
  },
];

export const BalanceCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {balances.map(balance => (
        <Card key={balance.title} className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <balance.icon className="h-5 w-5" />
              {balance.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-foreground">
              {balance.amount}
            </div>
            <div className="flex gap-2">
              {balance.actions.map(action => (
                <Button
                  key={action}
                  variant={action === 'TOP UP' ? 'default' : 'destructive'}
                  size="sm"
                  className="flex-1"
                >
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
