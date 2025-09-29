import {
  InvalidateOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { UserServices } from "./userService";
import { User } from "@/hooks/domain/user/schema.ts";

export const enum UserQueryKey {
  fetchUserProfile = "fetchUserProfile",
}

const useFetchProfileQuery = () =>
  useQuery({
    queryFn: () => UserServices.fetchProfile(),
    queryKey: [UserQueryKey.fetchUserProfile],
    staleTime: 0,
    initialData: null,
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
