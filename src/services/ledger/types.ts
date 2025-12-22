export interface ICreditPointRequest {
  points: number;
  toUserId: string;
  amount?: number;
  comment?: string;
}
