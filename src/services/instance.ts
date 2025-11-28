import ky from 'ky';
import { getIdToken, peekIdToken } from '@/services/auth';
import Config from 'react-native-config';
import Bugsnag from '@bugsnag/react-native';
import { showToast } from '@/utils';

const prefixUrl = Config.API_BASE_URL;

export const instance = ky.extend({
  headers: {
    Accept: 'application/json',
  },
  prefixUrl,
  timeout: 10000,
  retry: {
    limit: 3,
    methods: ['get', 'head', 'put', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    backoffLimit: 2000,
  },
  hooks: {
    beforeRequest: [
      async request => {
        const token = peekIdToken() ?? (await getIdToken());

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401) {
          const fresh = await getIdToken(true);
          request.headers.set('Authorization', `Bearer ${fresh}`);
          return ky(request);
        }

        if (!response.ok) {
          let errorBody: any = null;
          try {
            errorBody = await response.clone().json();
          } catch {
            try {
              errorBody = await response.clone().text();
            } catch {
              errorBody = null;
            }
          }

          const message =
            typeof errorBody === 'string'
              ? errorBody
              : errorBody?.message || errorBody?.error || 'Unknown error';

          Bugsnag.notify(new Error(`API Error: ${response.status}`), event => {
            event.severity = 'warning';
            event.context = `${request.method?.toUpperCase()} ${request.url}`;
            event.addMetadata('response', {
              status: response.status,
              body: errorBody,
            });
          });
          console.error('error message', message);

          showToast({
            type: 'error',
            text1: 'Error',
            text2: message,
          });

          throw new Error(message);
        }

        return response;
      },
    ],
  },
});
