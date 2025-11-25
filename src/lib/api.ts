import axios, { AxiosRequestConfig } from 'axios';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipErrorToast?: boolean;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5001',
});

const waitForAuth = (): Promise<boolean> => {
  return new Promise(resolve => {
    if (auth.currentUser) {
      resolve(true);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

api.interceptors.request.use(async config => {
  // Wait for Firebase auth to initialize
  const isAuthenticated = await waitForAuth();

  if (isAuthenticated && auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // Track failed requests and show toast messages
    const { response, request, message, config } = error;

    // Check if this request should skip automatic error toasts
    const skipErrorToast = (config as CustomAxiosRequestConfig)?.skipErrorToast;

    if (!skipErrorToast) {
      if (response) {
        // Server responded with error status
        const { status, data } = response;
        const errorMessage =
          data?.message ||
          data?.error ||
          `Request failed with status ${status}`;

        // Don't show toast for 401 (unauthorized) as it's handled by auth flow
        if (status !== 401) {
          toast.error(errorMessage);
        }
      } else if (request) {
        // Request was made but no response received (network error)
        toast.error('Network error - please check your connection');
      } else {
        // Something else happened
        toast.error(message || 'An unexpected error occurred');
      }
    }

    return Promise.reject(error);
  }
);
