import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { rewardsApi, RewardStrategy } from '@/lib/rewardsApi';
import { toast } from 'sonner';

type Program = {
  id?: string;
  name?: string;
  strategy?: RewardStrategy;
  percentBack?: number | null;
  spendThreshold?: number | null;
  rewardPercent?: number | null;
  capPerTransaction?: number | null;
  maxMonthlyBudget?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  status?: 'INACTIVE' | 'ACTIVE' | 'PAUSED';
};

function numOrUndefined(v: string) {
  if (v === '' || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function RewardProgramModal({
  open,
  onClose,
  program,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  program?: Program;
  onUpdated: () => void;
}) {
  const isEdit = !!program?.id;

  const [strategy, setStrategy] = useState<RewardStrategy>(
    program?.strategy ?? 'PERCENT_BACK'
  );
  const [name, setName] = useState(program?.name ?? '');
  const [percentBack, setPercentBack] = useState(
    program?.percentBack?.toString() ?? ''
  );
  const [spendThreshold, setSpendThreshold] = useState(
    program?.spendThreshold?.toString() ?? ''
  );
  const [rewardPercent, setRewardPercent] = useState(
    program?.rewardPercent?.toString() ?? ''
  );
  const [capPerTransaction, setCapPerTransaction] = useState(
    program?.capPerTransaction?.toString() ?? ''
  );
  const [maxMonthlyBudget, setMaxMonthlyBudget] = useState(
    program?.maxMonthlyBudget?.toString() ?? ''
  );
  const [startsAt, setStartsAt] = useState(program?.startsAt ?? '');
  const [endsAt, setEndsAt] = useState(program?.endsAt ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStrategy(program?.strategy ?? 'PERCENT_BACK');
    setName(program?.name ?? '');
    setPercentBack(program?.percentBack?.toString() ?? '');
    setSpendThreshold(program?.spendThreshold?.toString() ?? '');
    setRewardPercent(program?.rewardPercent?.toString() ?? '');
    setCapPerTransaction(program?.capPerTransaction?.toString() ?? '');
    setMaxMonthlyBudget(program?.maxMonthlyBudget?.toString() ?? '');
    setStartsAt(program?.startsAt ?? '');
    setEndsAt(program?.endsAt ?? '');
  }, [open, program]);

  const fieldsValid = useMemo(() => {
    if (!name.trim()) return false;

    if (strategy === 'PERCENT_BACK') {
      const pb = numOrUndefined(percentBack);
      if (!pb || pb <= 0 || pb > 100) return false;
    } else {
      const th = numOrUndefined(spendThreshold);
      const rp = numOrUndefined(rewardPercent);
      if (!th || th <= 0) return false;
      if (!rp || rp <= 0 || rp > 100) return false;
    }

    return true;
  }, [name, strategy, percentBack, spendThreshold, rewardPercent]);

  const buildPayload = () => {
    const payload: any = {
      name: name.trim(),
      strategy,
      capPerTransaction: numOrUndefined(capPerTransaction),
      maxMonthlyBudget: numOrUndefined(maxMonthlyBudget),
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
    };

    if (strategy === 'PERCENT_BACK') {
      payload.percentBack = numOrUndefined(percentBack);
      payload.spendThreshold = undefined;
      payload.rewardPercent = undefined;
    } else {
      payload.percentBack = undefined;
      payload.spendThreshold = numOrUndefined(spendThreshold);
      payload.rewardPercent = numOrUndefined(rewardPercent);
    }

    return payload;
  };

  const onSubmit = async () => {
    if (!fieldsValid) {
      toast.error('Please fill required fields correctly');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEdit && program?.id) {
        await rewardsApi.updateProgram(program.id, payload);
        toast.success('Program updated');
      } else {
        await rewardsApi.createProgram(payload);
        toast.success('Program created');
      }
      onUpdated();
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Failed to save program');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Configure Program' : 'Create Program'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Program Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Instant Cashback"
            />
          </div>

          <div>
            <Label>Strategy</Label>
            <Select
              value={strategy}
              onValueChange={v => setStrategy(v as RewardStrategy)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT_BACK">Percent Back</SelectItem>
                <SelectItem value="SPEND_TO_EARN">Spend-to-Earn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {strategy === 'PERCENT_BACK' ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Percent Back (%)</Label>
                <Input
                  inputMode="decimal"
                  placeholder="e.g. 5"
                  value={percentBack}
                  onChange={e => setPercentBack(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Spend Threshold</Label>
                <Input
                  inputMode="decimal"
                  placeholder="e.g. 100"
                  value={spendThreshold}
                  onChange={e => setSpendThreshold(e.target.value)}
                />
              </div>
              <div>
                <Label>Reward Percent (%)</Label>
                <Input
                  inputMode="decimal"
                  placeholder="e.g. 5"
                  value={rewardPercent}
                  onChange={e => setRewardPercent(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cap per Transaction</Label>
              <Input
                inputMode="decimal"
                placeholder="e.g. 25"
                value={capPerTransaction}
                onChange={e => setCapPerTransaction(e.target.value)}
              />
            </div>
            <div>
              <Label>Max Monthly Budget</Label>
              <Input
                inputMode="decimal"
                placeholder="e.g. 750"
                value={maxMonthlyBudget}
                onChange={e => setMaxMonthlyBudget(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Starts At (ISO)</Label>
              <Input
                placeholder="2025-10-01T00:00:00.000Z"
                value={startsAt ?? ''}
                onChange={e => setStartsAt(e.target.value)}
              />
            </div>
            <div>
              <Label>Ends At (ISO)</Label>
              <Input
                placeholder="2026-03-31T23:59:59.000Z"
                value={endsAt ?? ''}
                onChange={e => setEndsAt(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full" onClick={onSubmit} disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
