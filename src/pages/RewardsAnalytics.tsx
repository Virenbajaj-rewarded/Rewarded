import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RewardsMetrics } from '@/components/rewards-analytics/RewardsMetrics';

const RewardsAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Rewards Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyze your rewards program performance and ROI
          </p>
        </div>

        <RewardsMetrics />
      </div>
    </DashboardLayout>
  );
};

export default RewardsAnalytics;
