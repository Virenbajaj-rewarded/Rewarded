import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RewardProgramCard } from '@/components/rewards/RewardProgramCard';
import { useEffect, useState } from 'react';
import { rewardsApi } from '@/lib/rewardsApi';
import { Button } from '@/components/ui/button';
import { RewardProgramModal } from '@/pages/RewardProgramModal.tsx';

const RewardsProgram = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    const { data } = await rewardsApi.getPrograms();
    setPrograms(data.items || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Rewards Program
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage your customer rewards program
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="max-w-2xl">
            <Button onClick={() => setModalOpen(true)}>
              Create Reward Program
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 max-w-2xl">
            {programs.map(p => (
              <RewardProgramCard key={p.id} program={p} onUpdated={load} />
            ))}
          </div>
        )}
      </div>

      <RewardProgramModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdated={load}
      />
    </DashboardLayout>
  );
};

export default RewardsProgram;
