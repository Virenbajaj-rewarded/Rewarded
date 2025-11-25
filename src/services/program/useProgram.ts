import {
  useInfiniteQuery,
  useQueryClient,
  InvalidateOptions,
  useMutation,
} from '@tanstack/react-query';
import { ProgramServices } from './programService';
import { ICreateProgramPayload, IEditProgramPayload } from './program.types';
import { EProgramStatus } from '@/enums';
import { toast } from 'sonner';
import { UserQueryKey } from '../user/useUser';

export const enum ProgramQueryKey {
  fetchPrograms = 'fetchPrograms',
}

const useFetchProgramsQuery = (status: EProgramStatus) =>
  useInfiniteQuery({
    queryKey: [ProgramQueryKey.fetchPrograms, status],
    queryFn: ({ pageParam = 1 }) =>
      ProgramServices.fetchPrograms({ page: pageParam, status }),
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      const hasMore = page < Math.ceil(total / limit);
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 180000,
  });

export const useProgram = () => {
  const client = useQueryClient();

  const createProgramMutation = useMutation({
    mutationFn: (program: ICreateProgramPayload) =>
      ProgramServices.createProgram(program),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      toast.success(`Program created successfully`);
    },
    onError: error => {
      console.error('Failed to create program:', error);
    },
  });

  const editProgramMutation = useMutation({
    mutationFn: (program: IEditProgramPayload) =>
      ProgramServices.editProgram(program),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      toast.success(`Program edited successfully`);
    },
    onError: error => {
      console.error('Failed to edit program:', error);
    },
  });

  const activateProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.activateProgram(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      toast.success(`Program activated successfully`);
    },
    onError: error => {
      console.error('Failed to activate program:', error);
    },
  });

  const stopProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.stopProgram(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      toast.success(`Program stopped successfully`);
    },
    onError: error => {
      console.error('Failed to stop program:', error);
    },
  });

  const renewProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.renewProgram(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      toast.success(`Program renewed successfully`);
    },
    onError: error => {
      console.error('Failed to renew program:', error);
    },
  });

  const withdrawProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.withdrawProgram(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      toast.success(`Program withdrawn successfully`);
    },
    onError: error => {
      console.error('Failed to withdraw program:', error);
    },
  });

  const topUpProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.topUpProgram(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      toast.success(`Program topped up successfully`);
    },
    onError: error => {
      console.error('Failed to top up program:', error);
    },
  });

  const requestProgramActivationMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.requestProgramActivation(id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
    },
    onError: error => {
      console.error('Failed to request program activation:', error);
    },
  });

  const invalidateQuery = (
    queryKeys: ProgramQueryKey[],
    options?: InvalidateOptions
  ) =>
    client.invalidateQueries(
      {
        queryKey: queryKeys,
      },
      options
    );

  return {
    createProgram: createProgramMutation.mutateAsync,
    createProgramLoading: createProgramMutation.isPending,
    editProgram: editProgramMutation.mutateAsync,
    editProgramLoading: editProgramMutation.isPending,
    activateProgram: activateProgramMutation.mutateAsync,
    activateProgramLoading: activateProgramMutation.isPending,
    stopProgram: stopProgramMutation.mutateAsync,
    stopProgramLoading: stopProgramMutation.isPending,
    renewProgram: renewProgramMutation.mutateAsync,
    renewProgramLoading: renewProgramMutation.isPending,
    withdrawProgram: withdrawProgramMutation.mutateAsync,
    withdrawProgramLoading: withdrawProgramMutation.isPending,
    topUpProgram: topUpProgramMutation.mutateAsync,
    topUpProgramLoading: topUpProgramMutation.isPending,
    requestProgramActivation: requestProgramActivationMutation.mutateAsync,
    requestProgramActivationLoading: requestProgramActivationMutation.isPending,
    invalidateQuery,
    useFetchProgramsQuery,
  };
};
