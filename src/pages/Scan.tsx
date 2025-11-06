import { QRScanner } from '@/components/scan/QRScanner';

const Scan = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scan Customer QR</h1>
        <p className="text-muted-foreground mt-2">
          Scan customer QR codes to issue or redeem points
        </p>
      </div>

      <div className="max-w-2xl">
        <QRScanner />
      </div>
    </div>
  );
};

export default Scan;
