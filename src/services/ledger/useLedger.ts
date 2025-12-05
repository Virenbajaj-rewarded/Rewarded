import { useMutation } from '@tanstack/react-query';
import { creditPoint } from '@/services/ledger/ledgerService';
import { ICreditPointRequest } from './types';
import { toast } from 'sonner';

export const useLedger = () => {
  const creditPointMutation = useMutation({
    mutationFn: (payload: ICreditPointRequest) => creditPoint(payload),
    onError: error => {
      console.error('Failed to credit point:', error);
    },
    onSuccess: () => {
      toast.success('Points credited successfully');
    },
  });

  return {
    creditPoint: creditPointMutation.mutateAsync,
    creditPointLoading: creditPointMutation.isPending,
    creditPointError: creditPointMutation.error,
    creditPointSuccess: creditPointMutation.isSuccess,
  };
};
