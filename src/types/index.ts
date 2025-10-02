export const ACCESSIBLE_QR_TYPES = [
  "customer_profile",
  "invite",
  "payment",
] as const;

export type QRCodeType = (typeof ACCESSIBLE_QR_TYPES)[number];

export type QR_CODE = {
  type: QRCodeType;
  value: string;
};
