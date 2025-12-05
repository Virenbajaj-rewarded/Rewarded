import { api } from '@/lib/api';
import { ICreditPointRequest } from './types';

export const creditPoint = async (payload: ICreditPointRequest) => {
  const response = await api.post('/points/transfer', payload);

  return response.data;
};
