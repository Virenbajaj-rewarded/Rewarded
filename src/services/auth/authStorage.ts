import { storage } from '@/App';
import { ERole } from '@/enums';

const AUTH_KEY = 'isAuthenticated';
const ROLE_KEY = 'userRole';

export const setAuthState = (isAuthenticated: boolean, role?: ERole) => {
  storage.set(AUTH_KEY, isAuthenticated);
  if (role) {
    storage.set(ROLE_KEY, role);
  }
  if (!isAuthenticated) {
    storage.delete(ROLE_KEY);
  }
};

export const getAuthState = (): boolean => {
  return storage.getBoolean(AUTH_KEY) ?? false;
};

export const getAuthRole = (): ERole | null => {
  const role = storage.getString(ROLE_KEY);
  return (role as ERole) || null;
};

export const clearAuthState = () => {
  storage.delete(AUTH_KEY);
  storage.delete(ROLE_KEY);
};
