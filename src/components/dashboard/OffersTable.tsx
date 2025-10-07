import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const topOffers = [
  { program: 'Earn 10% on $200', rewards: '600' },
  { program: '5% Instant Reward', rewards: '400' },
  { program: 'Earn $10 on $150', rewards: '200' },
];

export const OffersTable = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Top Offers/Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground font-medium pb-2 border-b border-border">
            <div>Offer/Program</div>
            <div>Rewards Issued</div>
          </div>
          {topOffers.map(offer => (
            <div key={offer.program} className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-foreground">{offer.program}</div>
              <div className="text-foreground font-medium">{offer.rewards}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
