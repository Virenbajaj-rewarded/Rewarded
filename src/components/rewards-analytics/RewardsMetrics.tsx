import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Gift, Target, TrendingUp, Users } from 'lucide-react';
import { api } from '@/lib/api';

type Overview = {
  programId: string | null;
  issuedTotal: number;
  redeemedTotal: number;
  issuedToday: number;
  redeemedToday: number;
  issuedPrevDay: number;
  redeemedPrevDay: number;
  issuedDeltaPct: number;
  redeemedDeltaPct: number;
};

const pctLabel = (n: number) => `${n >= 0 ? '+' : ''}${n}%`;
const fmt = (n: number) => n.toLocaleString();

export const RewardsMetrics = () => {
  const [ov, setOv] = useState<Overview | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Overview>('/metrics/rewards/overview');
        setOv(data);
      } catch {
        setOv({
          programId: null,
          issuedTotal: 0,
          redeemedTotal: 0,
          issuedToday: 0,
          redeemedToday: 0,
          issuedPrevDay: 0,
          redeemedPrevDay: 0,
          issuedDeltaPct: 0,
          redeemedDeltaPct: 0,
        });
      }
    })();
  }, []);

  const performance = useMemo(() => {
    const issued = {
      title: 'Points Issued',
      value: fmt(ov?.issuedTotal ?? 0),
      change: pctLabel(ov?.issuedDeltaPct ?? 0),
      icon: Gift,
    };
    const redeemed = {
      title: 'Points Redeemed',
      value: fmt(ov?.redeemedTotal ?? 0),
      change: pctLabel(ov?.redeemedDeltaPct ?? 0),
      icon: Award,
    };
    const roi = {
      title: 'Program ROI',
      value: '—',
      change: '+0%',
      icon: TrendingUp,
    };
    const retention = {
      title: 'Customer Retention',
      value: '—',
      change: '+0%',
      icon: Users,
    };
    return [issued, redeemed, roi, retention];
  }, [ov]);

  const programStats = [
    { label: 'Redemption Rate', value: 71, target: 75 },
    { label: 'Customer Engagement', value: 84, target: 80 },
    { label: 'Repeat Visits', value: 65, target: 70 },
  ];

  const topRewards = [
    { item: 'Free Coffee', redeemed: 245, points: 100 },
    { item: '20% Off Purchase', redeemed: 189, points: 150 },
    { item: 'Free Pastry', redeemed: 156, points: 75 },
    { item: 'Buy 1 Get 1', redeemed: 98, points: 200 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performance.map(metric => (
          <Card key={metric.title} className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <metric.icon className="h-8 w-8 text-primary" />
                <Badge variant="secondary" className="text-success">
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="h-5 w-5" />
              Program Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {programStats.map(stat => (
              <div key={stat.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="text-foreground font-medium">
                    {stat.value}%
                  </span>
                </div>
                <Progress value={stat.value} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Target: {stat.target}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Award className="h-5 w-5" />
              Popular Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRewards.map((reward, index) => (
                <div
                  key={reward.item}
                  className="flex items-center justify-between p-3 bg-card/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {reward.item}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reward.points} points
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {reward.redeemed}
                    </p>
                    <p className="text-sm text-muted-foreground">redeemed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
