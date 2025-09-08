import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Gift, Settings } from "lucide-react";
import { useState } from "react";

export const RewardProgramCard = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Gift className="h-5 w-5" />
            Rewards Program
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <Switch 
              checked={isActive} 
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Program Types */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Program Types</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="font-medium text-foreground">Instant Cashback</div>
              <div className="text-muted-foreground">10% back</div>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="font-medium text-foreground">Spend-to-Earn</div>
              <div className="text-muted-foreground">$100 = 5%</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Cap Per Transaction</div>
              <div className="font-medium text-foreground">$25</div>
            </div>
            <div>
              <div className="text-muted-foreground">Max Monthly Budget</div>
              <div className="font-medium text-foreground">$750</div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Settings className="mr-2 h-4 w-4" />
          Configure Program
        </Button>
      </CardContent>
    </Card>
  );
};