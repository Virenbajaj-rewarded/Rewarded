import { api } from '@/lib/api';

export type RewardStrategy = 'PERCENT_BACK' | 'SPEND_TO_EARN';

export const rewardsApi = {
  getPrograms: () => api.get('/reward-programs'),
  createProgram: (data: any) => api.post('/reward-programs', data),
  updateProgram: (id: string, data: any) =>
    api.patch(`/reward-programs/${id}`, data),
  setStatus: (id: string, status: 'ACTIVE' | 'INACTIVE' | 'PAUSED') =>
    api.patch(`/reward-programs/${id}`, { status }),
};
