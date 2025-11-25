import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LedgerRequest, Transaction } from '@/services/ledger/schema';
import { LedgerService } from '@/services/ledger/ledgerService';
import { UserQueryKey } from '@/services/user/useUser';

export const useCreateLedger = () => {
  const client = useQueryClient();

  return useMutation<Transaction, unknown, LedgerRequest>({
    mutationFn: payload => LedgerService.create(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
    },
  });
};
