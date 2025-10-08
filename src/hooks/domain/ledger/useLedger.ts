import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LedgerRequest, Transaction } from "@/hooks/domain/ledger/schema.ts";
import { LedgerService } from "@/hooks/domain/ledger/ledgerService.ts";
import { UserQueryKey } from "@/hooks/domain/user/useUser.ts";

export const useCreateLedger = () => {
  const client = useQueryClient();

  return useMutation<Transaction, unknown, LedgerRequest>({
    mutationFn: (payload) => LedgerService.create(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchMerchantBalance],
      });
    },
  });
};
