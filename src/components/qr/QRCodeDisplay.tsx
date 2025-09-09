import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, QrCode, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type QrEnum = "EARN" | "REDEEM";

type QrRecord = {
    id: string;
    type: QrEnum;
    code: string;
    payload: string;
    createdAt: string;
};

interface QRCodeDisplayProps {
    title: string;
    type: QrEnum;
    record: QrRecord | null;
    onRegenerate: () => Promise<void>;
}

export const QRCodeDisplay = ({ title, type, record, onRegenerate }: QRCodeDisplayProps) => {
    const { toast } = useToast();
    const [svgPreview, setSvgPreview] = useState<string | null>(null);
    const [downloading, setDownloading] = useState<null | "png" | "svg">(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        const fetchSvg = async () => {
            if (!record) return;
            try {
                const res = await api.get(`/merchants/qr-codes/download/svg`, {
                    params: { type },
                    responseType: "text",
                });
                setSvgPreview(res.data as string);
            } catch {
                setSvgPreview(null);
            }
        };
        fetchSvg();
    }, [record, type]);

    const handleRegenerate = async () => {
        try {
            setIsRegenerating(true);
            await api.post(`/merchants/qr-codes/regenerate`, null, { params: { type } });
            await onRegenerate();
            toast({ title: "QR Code Regenerated", description: `${type} QR refreshed` });
        } catch {
            toast({ title: "Failed to regenerate", variant: "destructive" });
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleCopy = async () => {
        if (!record?.code) return;
        await navigator.clipboard.writeText(record.code);
        toast({ title: "Copied!", description: "QR code copied to clipboard" });
    };

    const downloadFile = async (fmt: "png" | "svg") => {
        setDownloading(fmt);
        try {
            const res = await api.get(`/merchants/qr-codes/download/${fmt}`, {
                params: { type },
                responseType: fmt === "png" ? "blob" : "text",
            });
            const blob =
                fmt === "png"
                    ? (res.data as Blob)
                    : new Blob([res.data as string], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${type}.${fmt}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } finally {
            setDownloading(null);
        }
    };

    return (
        <Card className="bg-gradient-card shadow-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {isRegenerating ? "Generating..." : "Generate New"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center">
                    <div className="w-48 h-48 bg-background border-2 border-primary rounded-lg flex items-center justify-center p-2">
                        {record && svgPreview ? (
                            <div
                                className="w-full h-full flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: svgPreview }}
                            />
                        ) : (
                            <QrCode className="w-12 h-12 text-muted-foreground" />
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between bg-background rounded-lg p-3 border border-border">
                    <span className="font-mono">{record?.code ?? "—"}</span>
                    <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!record}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        onClick={() => downloadFile("png")}
                        disabled={!record || downloading === "png"}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {downloading === "png" ? "Downloading…" : "Download PNG"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => downloadFile("svg")}
                        disabled={!record || downloading === "svg"}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {downloading === "svg" ? "Downloading…" : "Download SVG"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
