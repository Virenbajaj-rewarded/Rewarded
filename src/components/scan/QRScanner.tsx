import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Camera, Gift, Scan, User, Wallet } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type ScanEvent = {
  customer: string;
  action: 'Earned' | 'Redeemed';
  points: number;
  time: string;
};

const toCents = (val: number | '') =>
  typeof val === 'number' && !Number.isNaN(val) ? Math.round(val * 100) : 0;

const makeIdemKey = () =>
  window.crypto && 'randomUUID' in window.crypto
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const timeAgo = (iso: string) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  return `${d} d ago`;
};

export const QRScanner: React.FC = () => {
  const { toast } = useToast();

  const [recentScans, setRecentScans] = useState<ScanEvent[]>([]);
  const [phone, setPhone] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState<number | ''>('');
  const [redeemPoints, setRedeemPoints] = useState<number | ''>('');
  const [loadingEarn, setLoadingEarn] = useState(false);
  const [loadingRedeem, setLoadingRedeem] = useState(false);

  const [cameraOn, setCameraOn] = useState(false);
  const [scanMode, setScanMode] = useState<'earn' | 'redeem'>('earn');
  const HARD_PHONE = '+380960000000';
  const [camPurchaseAmount, setCamPurchaseAmount] = useState<number | ''>('');
  const [camRedeemPoints, setCamRedeemPoints] = useState<number | ''>('');

  const ensurePhone = (p: string): string | null => {
    if (!p || !p.startsWith('+')) {
      toast({
        title: 'Invalid phone',
        description: 'Phone must be in E.164 format, e.g. +380991234567',
        variant: 'destructive',
      });
      return null;
    }
    return p.trim();
  };

  const mapRecent = (
    items: Array<{
      type: 'EARN' | 'REDEEM';
      points: number;
      createdAt: string;
      consumerPhone?: string | null;
      consumerEmail?: string | null;
    }>
  ): ScanEvent[] =>
    items.map(it => ({
      customer: it.consumerPhone ?? it.consumerEmail ?? 'Unknown',
      action: it.type === 'EARN' ? 'Earned' : 'Redeemed',
      points: Math.abs(it.points),
      time: timeAgo(it.createdAt),
    }));

  const loadRecent = async () => {
    try {
      const { data } = await api.get<{ items: any[] }>('/ledger/recent', {
        params: { limit: 3 },
      });
      setRecentScans(mapRecent(data.items));
    } catch {}
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const addEventTop = (cust: string, action: 'Earned' | 'Redeemed', pts: number) => {
    setRecentScans(prev => [
      { customer: cust || 'Unknown', action, points: pts, time: 'Just now' },
      ...prev.slice(0, 2),
    ]);
  };

  const earnRequest = async (phoneNumber: string, amountInCents: number) => {
    const payload = { phoneNumber, amountCents: amountInCents, idempotencyKey: makeIdemKey() };
    const { data } = await api.post<{ points: number }>('/ledger/earn', payload);
    toast({ title: 'Points Issued', description: `+${data.points} pts` });
    addEventTop(phoneNumber, 'Earned', data.points);
    loadRecent();
  };

  const redeemRequest = async (phoneNumber: string, pts: number) => {
    const payload = { phoneNumber, points: pts, idempotencyKey: makeIdemKey() };
    const { data } = await api.post<{ points: number }>('/ledger/redeem', payload);
    toast({ title: 'Points Redeemed', description: `-${data.points} pts` });
    addEventTop(phoneNumber, 'Redeemed', data.points);
    loadRecent();
  };

  const handleEarn = async () => {
    const phoneNumber = ensurePhone(phone);
    if (!phoneNumber) return;
    const amountCents = toCents(purchaseAmount);
    if (!amountCents) {
      toast({
        title: 'Amount required',
        description: 'Enter purchase amount greater than 0',
        variant: 'destructive',
      });
      return;
    }
    setLoadingEarn(true);
    try {
      await earnRequest(phoneNumber, amountCents);
      setPurchaseAmount('');
    } catch (err: any) {
      toast({ title: 'Error', description: String(err?.message ?? 'Failed to issue points'), variant: 'destructive' });
    } finally {
      setLoadingEarn(false);
    }
  };

  const handleRedeem = async () => {
    const phoneNumber = ensurePhone(phone);
    if (!phoneNumber) return;
    const pts = typeof redeemPoints === 'number' ? redeemPoints : 0;
    if (!pts || pts < 1) {
      toast({
        title: 'Points required',
        description: 'Enter points to redeem (integer ≥ 1)',
        variant: 'destructive',
      });
      return;
    }
    setLoadingRedeem(true);
    try {
      await redeemRequest(phoneNumber, pts);
      setRedeemPoints('');
    } catch (err: any) {
      toast({ title: 'Error', description: String(err?.message ?? 'Failed to redeem points'), variant: 'destructive' });
    } finally {
      setLoadingRedeem(false);
    }
  };

  const handleCamEarn = async () => {
    const amountCents = toCents(camPurchaseAmount);
    if (!amountCents) {
      toast({
        title: 'Amount required',
        description: 'Enter purchase amount greater than 0',
        variant: 'destructive',
      });
      return;
    }
    try {
      await earnRequest(HARD_PHONE, amountCents);
      setCamPurchaseAmount('');
    } catch (err: any) {
      toast({ title: 'Error', description: String(err?.message ?? 'Failed to issue points'), variant: 'destructive' });
    }
  };

  const handleCamRedeem = async () => {
    const pts = typeof camRedeemPoints === 'number' ? camRedeemPoints : 0;
    if (!pts || pts < 1) {
      toast({
        title: 'Points required',
        description: 'Enter points to redeem (integer ≥ 1)',
        variant: 'destructive',
      });
      return;
    }
    try {
      await redeemRequest(HARD_PHONE, pts);
      setCamRedeemPoints('');
    } catch (err: any) {
      toast({ title: 'Error', description: String(err?.message ?? 'Failed to redeem points'), variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="scan">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Camera className="h-5 w-5" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!cameraOn ? (
                <div className="aspect-square bg-muted/20 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Position customer QR code in view</p>
                    <Button onClick={() => setCameraOn(true)}>Start Camera</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Customer: <span className="font-medium text-foreground">{HARD_PHONE}</span>
                    </div>
                    <Button variant="ghost" onClick={() => setCameraOn(false)}>Close</Button>
                  </div>

                  <Tabs value={scanMode} onValueChange={v => setScanMode(v as 'earn' | 'redeem')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="earn">Issue Points</TabsTrigger>
                      <TabsTrigger value="redeem">Redeem Points</TabsTrigger>
                    </TabsList>

                    <TabsContent value="earn" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cam-purchase-amount">Purchase Amount ($)</Label>
                        <Input
                          id="cam-purchase-amount"
                          type="number"
                          inputMode="decimal"
                          placeholder="0.00"
                          value={camPurchaseAmount}
                          onChange={e => setCamPurchaseAmount(e.target.value ? Number(e.target.value) : '')}
                        />
                      </div>
                      <Button className="w-full" onClick={handleCamEarn}>
                        <Gift className="h-4 w-4 mr-2" />
                        Issue Points
                      </Button>
                    </TabsContent>

                    <TabsContent value="redeem" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cam-redeem-points">Points to Redeem</Label>
                        <Input
                          id="cam-redeem-points"
                          type="number"
                          inputMode="numeric"
                          placeholder="100"
                          value={camRedeemPoints}
                          onChange={e => setCamRedeemPoints(e.target.value ? Number(e.target.value) : '')}
                        />
                      </div>
                      <Button variant="outline" className="w-full" onClick={handleCamRedeem}>
                        <Wallet className="h-4 w-4 mr-2" />
                        Redeem Points
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5" />
                Manual Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Customer Phone (+...)</Label>
                <Input
                  id="phone"
                  placeholder="+380991234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <Tabs defaultValue="earn" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="earn">Issue Points</TabsTrigger>
                  <TabsTrigger value="redeem">Redeem Points</TabsTrigger>
                </TabsList>

                <TabsContent value="earn" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-amount">Purchase Amount ($)</Label>
                    <Input
                      id="purchase-amount"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={purchaseAmount}
                      onChange={e => setPurchaseAmount(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                  <Button className="w-full" onClick={handleEarn} disabled={loadingEarn}>
                    <Gift className="h-4 w-4 mr-2" />
                    {loadingEarn ? 'Issuing...' : 'Issue Points'}
                  </Button>
                </TabsContent>

                <TabsContent value="redeem" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="redeem-points">Points to Redeem</Label>
                    <Input
                      id="redeem-points"
                      type="number"
                      inputMode="numeric"
                      placeholder="100"
                      value={redeemPoints}
                      onChange={e => setRedeemPoints(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleRedeem} disabled={loadingRedeem}>
                    <Wallet className="h-4 w-4 mr-2" />
                    {loadingRedeem ? 'Redeeming...' : 'Redeem Points'}
                  </Button>
                </TabsContent>
              </Tabs>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentScans.map((scan, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{scan.customer}</p>
                            <p className="text-sm text-muted-foreground">{scan.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={scan.action === 'Earned' ? 'default' : 'destructive'}>
                            {scan.action}
                          </Badge>
                          <span className={`font-medium ${scan.action === 'Earned' ? 'text-success' : 'text-destructive'}`}>
                            {scan.action === 'Earned' ? '+' : '-'}
                            {scan.points} pts
                          </span>
                        </div>
                      </div>
                    ))}
                    {recentScans.length === 0 && (
                      <div className="text-sm text-muted-foreground">No activity yet.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
