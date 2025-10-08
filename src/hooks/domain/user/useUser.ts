import {
  InvalidateOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { UserServices } from "./userService";
import { User } from "@/hooks/domain/user/schema.ts";

export const enum UserQueryKey {
  fetchUserProfile = "fetchUserProfile",
  fetchMerchantBalance = "fetchMerchantBalance",
  fetchCustomerBalance = "fetchCustomerBalance",
  fetchCustomerById = "fetchCustomerById",
}

const useFetchProfileQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchProfile(),
    queryKey: [UserQueryKey.fetchUserProfile],
    staleTime: 0,
  });

export const useFetchMerchantBalanceQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchMerchantBalance(),
    queryKey: [UserQueryKey.fetchMerchantBalance],
    staleTime: 300000,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    placeholderData: {
      type: "PAID",
      balance: 0,
    },
  });

export const useFetchCustomerBalanceQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchCustomerBalance(),
    queryKey: [UserQueryKey.fetchCustomerBalance],
    staleTime: 300000,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    placeholderData: [
      {
        type: "PAID",
        balance: 0,
      },
      {
        type: "FREE",
        balance: 0,
      },
    ],
  });

export const useFetchCustomerById = (id?: string) =>
  useQuery({
    queryFn: () => UserServices.fetchUserById(id!),
    queryKey: [UserQueryKey.fetchCustomerById, id],
    staleTime: 60 * 1000,
    enabled: !!id,
  });

export const useUser = () => {
  const client = useQueryClient();

  const invalidateQuery = (
    queryKeys: UserQueryKey[],
    options?: InvalidateOptions,
  ) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options,
    );

  const setQueryData = (profile: User | null) => {
    client.setQueryData([UserQueryKey.fetchUserProfile], profile);
  };

  return {
    invalidateQuery,
    useFetchProfileQuery,
    setQueryData,
  };
};
