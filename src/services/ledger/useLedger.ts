import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditPoint } from '@/services/ledger/ledgerService';
import { ICreditPointRequest } from './types';
import { toast } from 'sonner';
import { UserQueryKey } from '../user/useUser';

export const useLedger = () => {
  const queryClient = useQueryClient();
  const creditPointMutation = useMutation({
    mutationFn: (payload: ICreditPointRequest) => creditPoint(payload),
    onError: error => {
      console.error('Failed to credit point:', error);
    },
    onSuccess: () => {
      toast.success('Points credited successfully');
      queryClient.invalidateQueries({
        queryKey: [UserQueryKey.fetchTransactionHistory],
      });
      queryClient.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
    },
  });

  return {
    creditPoint: creditPointMutation.mutateAsync,
    creditPointLoading: creditPointMutation.isPending,
    creditPointError: creditPointMutation.error,
    creditPointSuccess: creditPointMutation.isSuccess,
  };
};
