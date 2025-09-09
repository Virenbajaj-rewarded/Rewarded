import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QRCodeDisplay } from "@/components/qr/QRCodeDisplay";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type QrRecord = {
    id: string;
    type: "EARN" | "REDEEM";
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
            const { data } = await api.get<QrAllResponse>("/merchants/qr-codes");
            setData(data);

            // если нет QR → сразу генерируем оба
            if (!data.earn) {
                await api.post("/merchants/qr-codes/regenerate", null, { params: { type: "EARN" } });
            }
            if (!data.redeem) {
                await api.post("/merchants/qr-codes/regenerate", null, { params: { type: "REDEEM" } });
            }

            if (!data.earn || !data.redeem) {
                // перезагрузить после генерации
                const { data: updated } = await api.get<QrAllResponse>("/merchants/qr-codes");
                setData(updated);
            }
        } catch (e) {
            toast({
                title: "Failed to load QR codes",
                description: e?.response?.data?.message ?? "Please try again",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQrs();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <p className="text-muted-foreground">Loading QR codes…</p>
            </DashboardLayout>
        );
    }

    if (!data) {
        return (
            <DashboardLayout>
                <p className="text-destructive">Failed to load QR codes.</p>
            </DashboardLayout>
        );
    }

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
        </DashboardLayout>
    );
};

export default QRCodes;
