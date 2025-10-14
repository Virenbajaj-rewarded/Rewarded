import { instance } from "@/services/instance";

import {
  LedgerRequest,
  ledgerRequestSchema,
  Transaction,
  transactionSchema,
} from "./schema";

export const LedgerService = {
  create: async (payload: LedgerRequest): Promise<Transaction> => {
    const body = ledgerRequestSchema.parse(payload);

    const response = await instance
      .post("ledger", {
        json: body,
      })
      .json<Transaction>();

    return transactionSchema.parse(response);
  },
};
