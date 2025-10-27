import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building, Check, Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type MerchantProfile = {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber?: string | null;
  businessAddress?: string | null;
  logoUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  suspendReason?: string | null;
  user: { id: string; email: string; role: string };
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const BusinessProfileForm = () => {
  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<MerchantProfile>('/merchants/me');
        setProfile(data);
      } catch (err) {
        console.error('Failed to load merchant profile', err);
        toast({
          title: 'Failed to load',
          description: 'Could not load merchant profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const onPickFile = () => fileInputRef.current?.click();

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file (PNG/JPG).',
        variant: 'destructive',
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Max size is 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<{ logoUrl: string }>(
        '/merchants/upload-logo',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setProfile(prev => (prev ? { ...prev, logoUrl: data.logoUrl } : prev));
      toast({
        title: 'Logo updated',
        description: 'Your business logo was uploaded successfully.',
      });
    } catch (err) {
      console.error('Upload failed', err);
      toast({
        title: 'Upload failed',
        description: 'Could not upload your logo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">Loading profile…</p>
    );
  }

  if (!profile) {
    return <p className="text-center text-destructive">Profile not found</p>;
  }

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
          {profile.status === 'APPROVED' && (
            <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
              <Check className="h-5 w-5 text-success" />
              <div>
                <p className="text-success font-medium">Account Approved</p>
                <p className="text-success/80 text-sm">
                  Your business profile has been verified
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Verified
              </Badge>
            </div>
          )}

          {profile.status === 'SUSPENDED' && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">Account Suspended</p>
              {profile.suspendReason && (
                <p className="text-destructive/80 text-sm">
                  Reason: {profile.suspendReason}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legal-name">Legal Business Name</Label>
              <Input id="legal-name" defaultValue={profile.businessName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dba">DBA (Doing Business As)</Label>
              <Input id="dba" defaultValue={profile.businessName} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea
              id="address"
              defaultValue={profile.businessAddress || ''}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                defaultValue={profile.businessPhoneNumber || ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={profile.businessEmail}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business Logo</Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={onFileSelected}
            />

            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer"
              onClick={onPickFile}
              role="button"
              aria-label="Upload logo"
            >
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt="Business Logo"
                  className="h-20 mx-auto object-contain"
                />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </>
              )}
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
