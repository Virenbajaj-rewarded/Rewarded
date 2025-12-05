import {
  useInfiniteQuery,
  useQueryClient,
  InvalidateOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { showToast } from '@/utils';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';
import { UserQueryKey } from '@/services/user/useUser';
import { ProgramServices } from './programService';
import { ICreateProgramPayload, IEditProgramPayload } from './program.types';

export const enum ProgramQueryKey {
  fetchPrograms = 'fetchPrograms',
  fetchProgram = 'fetchProgram',
}

const useFetchProgramsQuery = (status: EProgramStatus) =>
  useInfiniteQuery({
    queryKey: [ProgramQueryKey.fetchPrograms, status],
    queryFn: ({ pageParam = 1 }) => ProgramServices.fetchPrograms({ page: pageParam, status }),
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
    mutationFn: (program: ICreateProgramPayload) => ProgramServices.createProgram(program),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program created successfully',
      });
    },
    onError: error => {
      console.error('Failed to create program:', error);
    },
  });

  const useFetchProgramQuery = (id: string) =>
    useQuery({
      queryKey: [ProgramQueryKey.fetchProgram, id],
      queryFn: () => ProgramServices.fetchProgram(id),
      staleTime: 180000,
    });

  const editProgramMutation = useMutation({
    mutationFn: (program: IEditProgramPayload) => ProgramServices.editProgram(program),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program edited successfully',
      });
    },
    onError: error => {
      console.error('Failed to edit program:', error);
    },
  });

  const activateProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.activateProgram(id),
    onSuccess: (program: IProgram) => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchProgram, program.id],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program activated successfully',
      });
    },
    onError: error => {
      console.error('Failed to activate program:', error);
    },
  });

  const stopProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.stopProgram(id),
    onSuccess: (program: IProgram) => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchProgram, program.id],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program stopped successfully',
      });
    },
    onError: error => {
      console.error('Failed to stop program:', error);
    },
  });

  const renewProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.renewProgram(id),
    onSuccess: (program: IProgram) => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchProgram, program.id],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program renewed successfully',
      });
    },
    onError: error => {
      console.error('Failed to renew program:', error);
    },
  });

  const withdrawProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.withdrawProgram(id),
    onSuccess: (program: IProgram) => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchProgram, program.id],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program withdrawn successfully',
      });
    },
    onError: error => {
      console.error('Failed to withdraw program:', error);
    },
  });

  const fundProgramMutation = useMutation({
    mutationFn: (id: string) => ProgramServices.fundProgram(id),
    onSuccess: (program: IProgram) => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchProgram, program.id],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program funded successfully',
      });
    },
    onError: error => {
      console.error('Failed to top up program:', error);
    },
  });

  const topUpProgramMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      ProgramServices.topUpProgram(id, amount),
    onSuccess: (program: IProgram) => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchProgram, program.id],
      });
      client.invalidateQueries({
        queryKey: [UserQueryKey.fetchBalance],
      });
      showToast({
        type: 'success',
        text1: 'Program topped up successfully',
      });
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

  const invalidateQuery = (queryKeys: ProgramQueryKey[], options?: InvalidateOptions) =>
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
    fundProgram: fundProgramMutation.mutateAsync,
    fundProgramLoading: fundProgramMutation.isPending,
    topUpProgram: topUpProgramMutation.mutateAsync,
    topUpProgramLoading: topUpProgramMutation.isPending,
    topUpProgramSuccess: topUpProgramMutation.isSuccess,
    requestProgramActivation: requestProgramActivationMutation.mutateAsync,
    requestProgramActivationLoading: requestProgramActivationMutation.isPending,
    invalidateQuery,
    useFetchProgramsQuery,
    useFetchProgramQuery,
  };
};
