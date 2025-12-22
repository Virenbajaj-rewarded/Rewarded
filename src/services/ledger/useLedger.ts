import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  creditPoint,
  requestPoints,
  checkRequestStatus,
  checkRequests,
  seenByMerchant,
  seenByUser,
  approveRequest,
  declineRequest,
  getPointsByAmount,
  creditUser,
} from '@/services/ledger/ledgerService';
import { UserQueryKey } from '@/services/user/useUser';
import { ProgramQueryKey } from '@/services/program/useProgram';
import { ICreditPointRequest, IRequestPointsRequest, ICreditUserRequest } from './types';
import { showToast } from '@/utils';
import { MerchantQueryKey } from '@/services/merchant/useMerchant';

export const useLedger = () => {
  const client = useQueryClient();

  const creditPointMutation = useMutation({
    mutationFn: (payload: ICreditPointRequest) => creditPoint(payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [UserQueryKey.fetchBalance] });
      client.invalidateQueries({ queryKey: [UserQueryKey.fetchTransactionHistory] });
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
      client.invalidateQueries({ queryKey: [UserQueryKey.fetchTransactionHistory] });
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

  const creditUserMutation = useMutation({
    mutationFn: async (payload: ICreditUserRequest) => {
      const response = await creditUser(payload);
      return response.programId;
    },
    onSuccess: (programId: string) => {
      client.invalidateQueries({ queryKey: [UserQueryKey.fetchBalance] });
      client.invalidateQueries({ queryKey: [ProgramQueryKey.fetchPrograms] });
      client.invalidateQueries({ queryKey: [ProgramQueryKey.fetchProgram, programId] });
      client.invalidateQueries({ queryKey: [MerchantQueryKey.fetchCustomers] });
      client.invalidateQueries({ queryKey: [MerchantQueryKey.fetchCustomerStats] });
    },
    onError: error => {
      console.error('Failed to credit user:', error);
    },
  });

  const useGetPointsByAmountQuery = (amount: number, userId: string) =>
    useQuery({
      queryKey: ['getPointsByAmount', amount, userId],
      queryFn: () => (amount > 0 ? getPointsByAmount(amount, userId) : null),
      staleTime: 30000,
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
    creditUser: creditUserMutation.mutateAsync,
    creditUserLoading: creditUserMutation.isPending,
    creditUserError: creditUserMutation.error,
    creditUserSuccess: creditUserMutation.isSuccess,
    useGetPointsByAmountQuery,
  };
};
