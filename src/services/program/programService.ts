import { api } from '@/lib/api';

import {
  IGetProgramsResponse,
  ICreateProgramPayload,
  IEditProgramPayload,
} from './program.types';
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
    const response = await api.get<IGetProgramsResponse>(`/reward-programs`, {
      params: {
        limit: 12,
        page,
        status,
      },
    });
    return response.data;
  },
  createProgram: async (program: ICreateProgramPayload) => {
    const response = await api.post<IProgram>(`/reward-programs`, program);
    return response.data;
  },
  editProgram: async (program: IEditProgramPayload) => {
    const { id, ...data } = program;
    const response = await api.patch<IProgram>(`/reward-programs/${id}`, data);
    return response.data;
  },
  activateProgram: async (id: string) => {
    const response = await api.post<IProgram>(
      `/reward-programs/${id}/activate`
    );
    return response.data;
  },
  stopProgram: async (id: string) => {
    const response = await api.post<IProgram>(`/reward-programs/${id}/stop`);
    return response.data;
  },
  renewProgram: async (id: string) => {
    const response = await api.post<IProgram>(`/reward-programs/${id}/renew`);
    return response.data;
  },
  withdrawProgram: async (id: string) => {
    const response = await api.post<IProgram>(
      `/reward-programs/${id}/withdraw`
    );
    return response.data;
  },
  fundProgram: async (id: string) => {
    const response = await api.post<IProgram>(`/reward-programs/${id}/fund`);
    return response.data;
  },
  topUpProgram: async (id: string, amount: number) => {
    const response = await api.post<IProgram>(`/reward-programs/${id}/top-up`, {
      amount,
    });
    return response.data;
  },
  requestProgramActivation: async (id: string) => {
    const response = await api.post<IProgram>(
      `/reward-programs/${id}/request-funds`
    );
    return response.data;
  },
};
