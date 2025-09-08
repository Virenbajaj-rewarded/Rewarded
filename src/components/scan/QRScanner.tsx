import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Camera, User, Gift, Wallet, Scan } from "lucide-react";

const recentScans = [
  { customer: "Sarah J.", action: "Earned", points: 50, time: "2 min ago" },
  { customer: "Mike C.", action: "Redeemed", points: -100, time: "5 min ago" },
  { customer: "Emily D.", action: "Earned", points: 25, time: "8 min ago" },
];

export const QRScanner = () => {
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
              <div className="aspect-square bg-muted/20 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Position customer QR code in view</p>
                  <Button>Start Camera</Button>
                </div>
              </div>
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
                <Label htmlFor="customer-id">Customer ID</Label>
                <Input id="customer-id" placeholder="Enter customer ID or phone" />
              </div>
              
              <Tabs defaultValue="earn" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="earn">Issue Points</TabsTrigger>
                  <TabsTrigger value="redeem">Redeem Points</TabsTrigger>
                </TabsList>
                
                <TabsContent value="earn" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-amount">Purchase Amount ($)</Label>
                    <Input id="purchase-amount" type="number" placeholder="0.00" />
                  </div>
                  <Button className="w-full">
                    <Gift className="h-4 w-4 mr-2" />
                    Issue Points
                  </Button>
                </TabsContent>
                
                <TabsContent value="redeem" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="redeem-points">Points to Redeem</Label>
                    <Input id="redeem-points" type="number" placeholder="100" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Wallet className="h-4 w-4 mr-2" />
                    Redeem Points
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
                  <Badge variant={scan.points > 0 ? "default" : "destructive"}>
                    {scan.action}
                  </Badge>
                  <span className={`font-medium ${scan.points > 0 ? 'text-success' : 'text-destructive'}`}>
                    {scan.points > 0 ? '+' : ''}{scan.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};