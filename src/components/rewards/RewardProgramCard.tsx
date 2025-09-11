import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Gift, Settings } from 'lucide-react';
import { useState } from 'react';
import { rewardsApi } from '@/lib/rewardsApi';
import { toast } from 'sonner';
import { RewardProgramModal } from '@/pages/RewardProgramModal.tsx';

export function RewardProgramCard({
  program,
  onUpdated,
}: {
  program: any;
  onUpdated: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isActive = program.status === 'ACTIVE';

  const toggleStatus = async (checked: boolean) => {
    setToggling(true);
    try {
      await rewardsApi.setStatus(program.id, checked ? 'ACTIVE' : 'INACTIVE');
      toast.success(`Program ${checked ? 'activated' : 'deactivated'}`);
      onUpdated();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to change status');
    } finally {
      setToggling(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Gift className="h-5 w-5" />
            {program.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {program.status}
            </Badge>
            <Switch
              checked={isActive}
              disabled={toggling}
              onCheckedChange={toggleStatus}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Program Type</h4>
          {program.strategy === 'PERCENT_BACK' ? (
            <div className="p-3 bg-background rounded-lg border border-border text-sm">
              <div className="font-medium text-foreground">Percent Back</div>
              <div className="text-muted-foreground">
                {program.percentBack}% back
              </div>
            </div>
          ) : (
            <div className="p-3 bg-background rounded-lg border border-border text-sm">
              <div className="font-medium text-foreground">Spend-to-Earn</div>
              <div className="text-muted-foreground">
                Spend {program.spendThreshold} → reward {program.rewardPercent}%
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Cap Per Transaction</div>
            <div className="font-medium text-foreground">
              {program.capPerTransaction ?? '-'}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Max Monthly Budget</div>
            <div className="font-medium text-foreground">
              {program.maxMonthlyBudget ?? '-'}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setModalOpen(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Configure Program
        </Button>
      </CardContent>

      <RewardProgramModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        program={program}
        onUpdated={onUpdated}
      />
    </Card>
  );
}
