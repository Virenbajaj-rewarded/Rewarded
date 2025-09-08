import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QRCodeDisplay } from "@/components/qr/QRCodeDisplay";

const QRCodes = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Business QR Code</h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage QR codes for customer transactions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QRCodeDisplay 
            title="Earn Points QR" 
            type="earn"
            code="EARN-8F3K-M1A7"
          />
          <QRCodeDisplay 
            title="Redeem Points QR" 
            type="redeem"
            code="REDEEM-9G4L-N2B8"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QRCodes;