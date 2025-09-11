import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Wallet,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const payoutHistory = [
  {
    id: 'PO-001',
    amount: 1250.0,
    status: 'Completed',
    date: '2024-01-08',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
  },
  {
    id: 'PO-002',
    amount: 875.5,
    status: 'Pending',
    date: '2024-01-10',
    txHash: null,
  },
  {
    id: 'PO-003',
    amount: 2100.75,
    status: 'Processing',
    date: '2024-01-12',
    txHash: null,
  },
];

export const PaymentRequests = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Transaction hash copied successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-primary" />
              <Badge variant="secondary" className="text-success">
                Available
              </Badge>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-foreground">
                $3,450.25
              </div>
              <p className="text-sm text-muted-foreground">USDC Balance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-primary" />
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-foreground">$875.50</div>
              <p className="text-sm text-muted-foreground">Pending Payout</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Wallet className="h-8 w-8 text-primary" />
              <Badge variant="secondary">Total</Badge>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-foreground">
                $12,456.80
              </div>
              <p className="text-sm text-muted-foreground">All-time Payouts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Request Payout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-card/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium text-foreground">
                  Wallet Verified
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                0x742d35Cc6627C0532c2002C8fa8b5b7c4a1d24A2
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout-amount">Payout Amount (USDC)</Label>
              <Input
                id="payout-amount"
                type="number"
                placeholder="0.00"
                max="3450.25"
              />
              <p className="text-xs text-muted-foreground">
                Maximum available: $3,450.25 USDC
              </p>
            </div>

            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm">
                  <p className="text-destructive font-medium">
                    Important Notice
                  </p>
                  <p className="text-destructive/80">
                    Payouts are processed within 24 hours. Network fees will be
                    deducted from the payout amount.
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Request Payout
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payoutHistory.map(payout => (
                <div key={payout.id} className="p-4 bg-card/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">
                        {payout.id}
                      </span>
                      <Badge
                        variant={
                          payout.status === 'Completed'
                            ? 'default'
                            : payout.status === 'Pending'
                              ? 'outline'
                              : 'secondary'
                        }
                      >
                        {payout.status}
                      </Badge>
                    </div>
                    <span className="font-medium text-foreground">
                      ${payout.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{payout.date}</span>
                    {payout.txHash && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(payout.txHash!)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        TX Hash
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
