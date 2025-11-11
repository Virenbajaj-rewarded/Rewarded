import { instance } from '@/services/instance';

import { IGetProgramsResponse, ICreateProgramPayload, IEditProgramPayload } from './program.types';
import { IProgram } from '@/interfaces';

export const ProgramServices = {
  fetchPrograms: async () => {
    const response = await instance.get<IGetProgramsResponse>(`reward-programs`).json();
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
};
