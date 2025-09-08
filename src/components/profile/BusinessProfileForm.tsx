import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building, Upload, Check } from "lucide-react";

export const BusinessProfileForm = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
            <Check className="h-5 w-5 text-success" />
            <div>
              <p className="text-success font-medium">Account Approved</p>
              <p className="text-success/80 text-sm">Your business profile has been verified</p>
            </div>
            <Badge variant="secondary" className="ml-auto">Verified</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legal-name">Legal Business Name</Label>
              <Input id="legal-name" defaultValue="Rewarded Coffee Co." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dba">DBA (Doing Business As)</Label>
              <Input id="dba" defaultValue="Rewarded Coffee" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea id="address" defaultValue="123 Main Street, Suite 100&#10;San Francisco, CA 94105" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" defaultValue="contact@rewardedcoffee.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Business Logo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
          
          <div className="pt-4">
            <Button className="w-full">Update Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};