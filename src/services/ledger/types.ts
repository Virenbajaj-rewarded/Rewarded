export interface ICreditPointRequest {
  points: number;
  toUserId: string;
  amountCents?: number;
  comment?: string;
}

export interface IRequestPointsRequest {
  amount: number;
  customerId: string;
  comment?: string;
}

export interface ICheckRequestsResponse {
  id: string;
  merchantId: string;
  customerId: string;
  amount: string;
  comment: string;
  status: string;
  shownToUser: boolean;
  shownToMerchant: boolean;
  createdAt: Date;
  merchant?: {
    businessName: string;
  };
  customer?: {
    fullName: string;
  };
  updatedAt: Date;
}
