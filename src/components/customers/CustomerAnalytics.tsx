import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Gift, Star, MoreHorizontal } from "lucide-react";

const customerMetrics = [
  { title: "Total Customers", value: "1,247", change: "+12%", icon: Users },
  { title: "Active This Month", value: "892", change: "+8%", icon: TrendingUp },
  { title: "Points Earned", value: "45,231", change: "+15%", icon: Gift },
  { title: "Avg. Rating", value: "4.8", change: "+0.2", icon: Star },
];

const topCustomers = [
  { name: "Sarah Johnson", points: 2450, visits: 24, tier: "Gold" },
  { name: "Michael Chen", points: 1980, visits: 19, tier: "Silver" },
  { name: "Emily Davis", points: 1750, visits: 18, tier: "Silver" },
  { name: "David Wilson", points: 1520, visits: 15, tier: "Bronze" },
  { name: "Lisa Anderson", points: 1340, visits: 14, tier: "Bronze" },
];

export const CustomerAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customerMetrics.map((metric) => (
          <Card key={metric.title} className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <metric.icon className="h-8 w-8 text-primary" />
                <Badge variant="secondary" className="text-success">
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.name} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.visits} visits</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-foreground">{customer.points.toLocaleString()} pts</p>
                    <Badge variant={customer.tier === 'Gold' ? 'default' : customer.tier === 'Silver' ? 'secondary' : 'outline'}>
                      {customer.tier}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};