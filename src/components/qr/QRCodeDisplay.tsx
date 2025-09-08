import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, QrCode } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  title: string;
  type: "earn" | "redeem";
  code?: string;
}

export const QRCodeDisplay = ({ title, type, code = "RWD-8F3K-M1A7" }: QRCodeDisplayProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "QR code copied to clipboard",
    });
  };

  const generateQR = () => {
    setIsGenerating(true);
    // Simulate QR generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "QR Code Generated",
        description: `New ${type} QR code created successfully`,
      });
    }, 1000);
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Visual */}
        <div className="flex justify-center">
          <div className="w-48 h-48 bg-background border-2 border-primary rounded-lg flex items-center justify-center">
            <QrCode className="w-32 h-32 text-muted-foreground" />
          </div>
        </div>
        
        {/* QR Code ID */}
        <div className="flex items-center justify-between bg-background rounded-lg p-3 border border-border">
          <span className="text-foreground font-mono">{code}</span>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={generateQR} disabled={isGenerating}>
            Generate New
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};