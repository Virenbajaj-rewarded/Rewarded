import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  creditPoint,
  requestPoints,
  checkRequestStatus,
  checkRequests,
  seenByMerchant,
  seenByUser,
  approveRequest,
  declineRequest,
} from '@/services/ledger/ledgerService';
import { UserQueryKey } from '@/services/user/useUser';
import { ICreditPointRequest, IRequestPointsRequest } from './types';
import { showToast } from '@/utils';

export const useLedger = () => {
  const client = useQueryClient();

  const creditPointMutation = useMutation({
    mutationFn: (payload: ICreditPointRequest) => creditPoint(payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [UserQueryKey.fetchBalance] });
    },
    onError: error => {
      console.error('Failed to credit point:', error);
    },
  });

  const requestPointsMutation = useMutation({
    mutationFn: (payload: IRequestPointsRequest) => requestPoints(payload),
    onError: error => {
      console.error('Failed to request points:', error);
    },
  });
  const checkRequestStatusMutation = useMutation({
    mutationFn: () => checkRequestStatus(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [UserQueryKey.fetchBalance] });
    },
    onError: error => {
      console.error('Failed to check request status:', error);
    },
  });

  const checkRequestsMutation = useMutation({
    mutationFn: () => checkRequests(),
    onError: error => {
      console.error('Failed to check requests:', error);
    },
  });

  const seenByMerchantMutation = useMutation({
    mutationFn: (requestId: string) => seenByMerchant(requestId),
  });

  const seenByUserMutation = useMutation({
    mutationFn: (requestId: string) => seenByUser(requestId),
  });

  const approveRequestMutation = useMutation({
    mutationFn: (requestId: string) => approveRequest(requestId),
    onSuccess: () => {
      showToast({
        type: 'success',
        text1: 'Request approved successfully',
      });
      client.invalidateQueries({ queryKey: [UserQueryKey.fetchBalance] });
    },
    onError: error => {
      console.error('Failed to approve request:', error);
    },
  });

  const declineRequestMutation = useMutation({
    mutationFn: (requestId: string) => declineRequest(requestId),
    onError: error => {
      console.error('Failed to decline request:', error);
    },
  });

  return {
    creditPoint: creditPointMutation.mutateAsync,
    creditPointLoading: creditPointMutation.isPending,
    creditPointError: creditPointMutation.error,
    creditPointSuccess: creditPointMutation.isSuccess,
    requestPoints: requestPointsMutation.mutateAsync,
    requestPointsSuccess: requestPointsMutation.isSuccess,
    requestPointsLoading: requestPointsMutation.isPending,
    requestPointsError: requestPointsMutation.error,
    checkRequestStatus: checkRequestStatusMutation.mutateAsync,
    checkRequestStatusLoading: checkRequestStatusMutation.isPending,
    checkRequestStatusError: checkRequestStatusMutation.error,
    checkRequestStatusSuccess: checkRequestStatusMutation.isSuccess,
    checkRequests: checkRequestsMutation.mutateAsync,
    checkRequestsLoading: checkRequestsMutation.isPending,
    checkRequestsError: checkRequestsMutation.error,
    checkRequestsSuccess: checkRequestsMutation.isSuccess,
    seenByMerchant: seenByMerchantMutation.mutateAsync,
    seenByUser: seenByUserMutation.mutateAsync,
    approveRequest: approveRequestMutation.mutateAsync,
    approveRequestLoading: approveRequestMutation.isPending,
    approveRequestError: approveRequestMutation.error,
    approveRequestSuccess: approveRequestMutation.isSuccess,
    declineRequest: declineRequestMutation.mutateAsync,
    declineRequestLoading: declineRequestMutation.isPending,
    declineRequestError: declineRequestMutation.error,
    declineRequestSuccess: declineRequestMutation.isSuccess,
  };
};
