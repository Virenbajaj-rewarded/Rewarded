export interface ICreditPointRequest {
  points: number;
  toUserId: string;
  amountCents?: number;
  comment?: string;
}
