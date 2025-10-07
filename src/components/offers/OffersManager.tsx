import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Eye, Plus, Send, Trash2 } from 'lucide-react';

const activeOffers = [
  {
    title: 'Double Points Weekend',
    description: 'Earn 2x points on all purchases',
    audience: 'All Customers',
    sent: 1247,
    opened: 892,
    status: 'Active',
    endDate: '2024-01-15',
  },
  {
    title: 'Free Coffee Friday',
    description: 'Redeem 50 points for free coffee',
    audience: 'Gold Members',
    sent: 234,
    opened: 187,
    status: 'Active',
    endDate: '2024-01-12',
  },
];

const draftOffers = [
  {
    title: 'New Year Special',
    description: '25% off all items',
    audience: 'VIP Customers',
    status: 'Draft',
  },
];

export const OffersManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Manage Offers
          </h2>
          <p className="text-muted-foreground">
            Create and send targeted promotions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Offers</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOffers.map((offer, index) => (
            <Card key={index} className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {offer.title}
                      </h3>
                      <Badge variant="default">{offer.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {offer.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Audience</p>
                        <p className="font-medium text-foreground">
                          {offer.audience}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-medium text-foreground">
                          {offer.sent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opened</p>
                        <p className="font-medium text-foreground">
                          {offer.opened.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ends</p>
                        <p className="font-medium text-foreground">
                          {offer.endDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftOffers.map((offer, index) => (
            <Card key={index} className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {offer.title}
                      </h3>
                      <Badge variant="outline">{offer.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {offer.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Audience: {offer.audience}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="create">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Create New Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="offer-title">Offer Title</Label>
                <Input id="offer-title" placeholder="Enter offer title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer-description">Description</Label>
                <Textarea
                  id="offer-description"
                  placeholder="Describe your offer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="gold">Gold Members</SelectItem>
                      <SelectItem value="silver">Silver Members</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
