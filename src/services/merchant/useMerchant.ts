import {
  InvalidateOptions,
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { useFirebaseAuthState } from '@/services/firebase/useFirebaseAuthState';
import { MerchantServices } from './merchantServices';
import { IGetMerchantResponse, IUpdateMerchantPayload } from './merchant.types';
import { toast } from 'sonner';

export const enum MerchantQueryKey {
  fetchMerchantProfile = 'fetchMerchantProfile',
  fetchMerchantBalance = 'fetchMerchantBalance',
  fetchMerchantByBusinessCode = 'fetchMerchantByBusinessCode',
}

export const useFetchMerchantProfileQuery = () => {
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuthState();

  return useQuery({
    queryFn: () => MerchantServices.fetchMerchantProfile(),
    queryKey: [MerchantQueryKey.fetchMerchantProfile],
    enabled: isAuthenticated && !authLoading,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useFetchMerchantByBusinessCodeQuery = (businessCode: string) =>
  useQuery({
    queryFn: () => MerchantServices.fetchMerchantByBusinessCode(businessCode),
    queryKey: [MerchantQueryKey.fetchMerchantByBusinessCode],
    enabled: !!businessCode,
  });

export const useUpdateMerchantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateMerchantPayload) =>
      MerchantServices.updateMerchant(data),
    onSuccess: updatedMerchant => {
      const currentMerchant = queryClient.getQueryData<IGetMerchantResponse>([
        MerchantQueryKey.fetchMerchantProfile,
      ]);
      const mergedMerchant = currentMerchant
        ? { ...currentMerchant, ...updatedMerchant }
        : updatedMerchant;
      queryClient.setQueryData(
        [MerchantQueryKey.fetchMerchantProfile],
        mergedMerchant
      );
      queryClient.invalidateQueries({
        queryKey: [MerchantQueryKey.fetchMerchantProfile],
      });
      toast.success('Business updated successfully');
    },
    onError: error => {
      console.error('Failed to update merchant:', error);
      toast.error('Failed to update business');
    },
  });
};

export const useUploadMerchantLogoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      logoUri,
      fileName,
      type,
    }: {
      logoUri: string;
      fileName: string;
      type: string;
    }) => MerchantServices.uploadMerchantLogo(logoUri, fileName, type),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MerchantQueryKey.fetchMerchantProfile],
      });
    },
    onError: error => {
      console.error('Failed to upload merchant logo:', error);
    },
  });
};

export const useMerchant = () => {
  const client = useQueryClient();

  const invalidateQuery = (
    queryKeys: MerchantQueryKey[],
    options?: InvalidateOptions
  ) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  const setQueryData = (profile: IGetMerchantResponse | null) => {
    client.setQueryData([MerchantQueryKey.fetchMerchantProfile], profile);
  };

  return {
    invalidateQuery,
    useFetchMerchantProfileQuery,
    setQueryData,
    useUpdateMerchantMutation,
    useUploadMerchantLogoMutation,
  };
};
