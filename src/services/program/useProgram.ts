import { useQuery, useQueryClient, InvalidateOptions, useMutation } from '@tanstack/react-query';
import { ProgramServices } from './programService';
import { ICreateProgramPayload, IEditProgramPayload } from './program.types';

export const enum ProgramQueryKey {
  fetchPrograms = 'fetchPrograms',
}

const useFetchProgramsQuery = () =>
  useQuery({
    queryKey: [ProgramQueryKey.fetchPrograms],
    queryFn: () => ProgramServices.fetchPrograms(),
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
    },
    onError: error => {
      console.error('Failed to create program:', error);
    },
  });

  const editProgramMutation = useMutation({
    mutationFn: (program: IEditProgramPayload) => ProgramServices.editProgram(program),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [ProgramQueryKey.fetchPrograms],
      });
    },
    onError: error => {
      console.error('Failed to edit program:', error);
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
    invalidateQuery,
    useFetchProgramsQuery,
  };
};
