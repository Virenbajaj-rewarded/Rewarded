import ky from "ky";
import { getIdToken, peekIdToken } from "@/services/auth";

const prefixUrl = `https://bk-xvaf.onrender.com/`;

export const instance = ky.extend({
  headers: {
    Accept: "application/json",
  },
  prefixUrl,
  timeout: 10000,
  retry: {
    limit: 3,
    methods: ["get", "head", "put", "delete", "options", "trace"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    backoffLimit: 2000,
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = peekIdToken() ?? (await getIdToken());

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401) {
          const fresh = await getIdToken(true);
          request.headers.set("Authorization", `Bearer ${fresh}`);
          return ky(request);
        }
        return response;
      },
    ],
  },
});
