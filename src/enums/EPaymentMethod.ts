export enum EPaymentMethod {
  POINT_BALANCE = 'pointBalance',
  VISA_MASTERCARD = 'visaMastercard',
  USDC = 'usdc',
}

export const EPaymentMethodDisplayNames = {
  [EPaymentMethod.POINT_BALANCE]: 'Point Balance',
  [EPaymentMethod.VISA_MASTERCARD]: 'Visa/Mastercard',
  [EPaymentMethod.USDC]: 'USDC (ERC20)',
};
