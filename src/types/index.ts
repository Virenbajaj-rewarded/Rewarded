export const ACCESSIBLE_QR_TYPES = [
  'customer_profile',
  'store_profile',
  'invite',
  'payment',
  'merchant_profile',
] as const;

export type QRCodeType = (typeof ACCESSIBLE_QR_TYPES)[number];

export type QR_CODE = {
  type: QRCodeType;
  value: string;
};
