export type LedgerEventUser = {
  id: string;
  fullName: string | null;
  role: {
    name: string;
  };
  merchant: {
    businessName: string;
  } | null;
};
