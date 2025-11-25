import { instance } from '@/services/instance';

import { IGetProgramsResponse, ICreateProgramPayload, IEditProgramPayload } from './program.types';
import { IProgram } from '@/interfaces';
import { EProgramStatus } from '@/enums';

export const ProgramServices = {
  fetchPrograms: async ({
    page = 1,
    status = EProgramStatus.DRAFT,
  }: {
    page?: number;
    status?: EProgramStatus;
  }) => {
    const response = await instance
      .get<IGetProgramsResponse>(`reward-programs`, {
        searchParams: {
          limit: 12,
          page,
          status,
        },
      })
      .json();
    return response;
  },
  createProgram: async (program: ICreateProgramPayload) => {
    const response = await instance.post<IProgram>(`reward-programs`, { json: program }).json();
    return response;
  },
  editProgram: async (program: IEditProgramPayload) => {
    const { id, ...data } = program;
    const response = await instance.patch<IProgram>(`reward-programs/${id}`, { json: data }).json();
    return response;
  },
  activateProgram: async (id: string) => {
    const response = await instance.post<IProgram>(`reward-programs/${id}/activate`);
    return response.json();
  },
  stopProgram: async (id: string) => {
    const response = await instance.post<IProgram>(`reward-programs/${id}/stop`);
    return response.json();
  },
  renewProgram: async (id: string) => {
    const response = await instance.post<IProgram>(`reward-programs/${id}/renew`);
    return response.json();
  },
  withdrawProgram: async (id: string) => {
    const response = await instance.post<IProgram>(`reward-programs/${id}/withdraw`);
    return response.json();
  },
  topUpProgram: async (id: string) => {
    const response = await instance.post<IProgram>(`reward-programs/${id}/fund`);
    return response.json();
  },
  requestProgramActivation: async (id: string) => {
    const response = await instance.post<IProgram>(`reward-programs/${id}/request-funds`);
    return response.json();
  },
};
