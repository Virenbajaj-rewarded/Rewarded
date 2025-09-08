import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RewardProgramCard } from "@/components/rewards/RewardProgramCard";

const RewardsProgram = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rewards Program</h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage your customer rewards program
          </p>
        </div>
        
        <div className="max-w-2xl">
          <RewardProgramCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RewardsProgram;