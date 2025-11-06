import { RewardsMetrics } from '@/components/rewards-analytics/RewardsMetrics';

const Programs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Programs</h1>
        <p className="text-muted-foreground mt-2">
          Manage your reward programs here.
        </p>
      </div>
      <RewardsMetrics />
    </div>
  );
};

export default Programs;
