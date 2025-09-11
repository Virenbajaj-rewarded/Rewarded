import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const topCustomers = [
  { name: 'Jane Doe', rewards: '$350' },
  { name: 'John Smith', rewards: '$275' },
  { name: 'Mary Johnson', rewards: '$150' },
];

export const CustomerTable = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground font-medium pb-2 border-b border-border">
            <div>Customer</div>
            <div>Rewards Issued</div>
          </div>
          {topCustomers.map(customer => (
            <div key={customer.name} className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-foreground">{customer.name}</div>
              <div className="text-foreground font-medium">
                {customer.rewards}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
