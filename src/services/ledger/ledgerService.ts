import { instance } from '@/services/instance';
import { ICreditPointRequest, IRequestPointsRequest, ICheckRequestsResponse } from './types';

export const creditPoint = async (payload: ICreditPointRequest) => {
  const response = await instance
    .post('points/transfer', {
      json: payload,
    })
    .json<{ success: boolean }>();

  return response.success;
};

export const requestPoints = async (payload: IRequestPointsRequest) => {
  const response = await instance
    .post('points/request', {
      json: payload,
    })
    .json<{ success: boolean }>();

  return response.success;
};

// TODO: Remove after Push notifications are implemented,
// Merchant polls for updates
export const checkRequestStatus = async () => {
  const response = await instance.get(`points/poll/merchant`).json<ICheckRequestsResponse>();
  return response;
};

// TODO: Remove after Push notifications are implemented,
// User polls for new payment requests
export const checkRequests = async () => {
  const response = await instance.get(`points/poll/user`).json<ICheckRequestsResponse>();

  return response;
};

export const seenByMerchant = async (requestId: string) => {
  const response = await instance.post(`points/merchant/seen/${requestId}`).json();
  return response;
};

export const seenByUser = async (requestId: string) => {
  const response = await instance.post(`points/user/seen/${requestId}`).json();
  return response;
};

export const approveRequest = async (requestId: string) => {
  const response = await instance.post(`points/approve/${requestId}`).json();
  return response;
};

export const declineRequest = async (requestId: string) => {
  const response = await instance.post(`points/decline/${requestId}`).json();
  return response;
};
