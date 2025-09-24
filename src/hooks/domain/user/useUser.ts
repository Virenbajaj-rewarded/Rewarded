import { useQuery, useQueryClient } from "@tanstack/react-query";

import { UserServices } from "./userService";

export const enum UserQueryKey {
  fetchUserProfile = "fetchUserProfile",
}

const useFetchProfileQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchProfile(),
    queryKey: [UserQueryKey.fetchUserProfile],
    staleTime: 0,
  });

export const useUser = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: UserQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  return {
    invalidateQuery,
    useFetchProfileQuery,
  };
};
