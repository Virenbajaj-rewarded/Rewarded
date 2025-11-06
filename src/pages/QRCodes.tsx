import { useEffect, useState } from 'react';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type QrRecord = {
  id: string;
  type: 'EARN' | 'REDEEM';
  code: string;
  payload: string;
  createdAt: string;
};

type QrAllResponse = {
  earn: QrRecord | null;
  redeem: QrRecord | null;
};

const QRCodes = () => {
  const { toast } = useToast();
  const [data, setData] = useState<QrAllResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadQrs = async () => {
    try {
      const { data } = await api.get<QrAllResponse>('/qr-codes/merchant');
      setData(data);

      if (!data.earn) {
        await api.post('/qr-codes/merchant/regenerate', null, {
          params: { type: 'EARN' },
        });
      }
      if (!data.redeem) {
        await api.post('/qr-codes/merchant/regenerate', null, {
          params: { type: 'REDEEM' },
        });
      }

      if (!data.earn || !data.redeem) {
        const { data: updated } = await api.get<QrAllResponse>('/qr-codes');
        setData(updated);
      }
    } catch (e) {
      toast({
        title: 'Failed to load QR codes',
        description: e?.response?.data?.message ?? 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQrs();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading QR codes…</p>;
  }

  if (!data) {
    return <p className="text-destructive">Failed to load QR codes.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          My Business QR Code
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate and manage QR codes for customer transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QRCodeDisplay
          title="Earn Points QR"
          type="EARN"
          record={data.earn}
          onRegenerate={loadQrs}
        />
        <QRCodeDisplay
          title="Redeem Points QR"
          type="REDEEM"
          record={data.redeem}
          onRegenerate={loadQrs}
        />
      </div>
    </div>
  );
};

export default QRCodes;
