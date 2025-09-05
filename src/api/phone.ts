import { api } from '../api';

export const phoneApi = {
    send:   (phone: string)               => api.post('/phone/send',   { phone }),
    resend: (phone: string)               => api.post('/phone/resend', { phone }),
    verify: (phone: string, code: string) => api.post('/phone/verify', { phone, code }),
};
