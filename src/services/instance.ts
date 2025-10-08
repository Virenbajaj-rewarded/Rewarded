import ky from "ky";
import { getIdToken, peekIdToken } from "@/services/auth";
import Config from "react-native-config";
import Bugsnag from "@bugsnag/react-native";

const prefixUrl = `${Config.API_BASE_URL}`;

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

        if (response.ok || [401, 404].includes(response.status)) {
          return response;
        }

        let responseBody: string | undefined;
        try {
          const cloned = response.clone();
          responseBody = await cloned.text();
        } catch (err) {
          responseBody = "<unreadable body>";
        }

        Bugsnag.notify(new Error(`API Error: ${response.status}`), (event) => {
          event.severity = "warning";
          event.context = `${request.method?.toUpperCase()} ${request.url}`;
          event.addMetadata("response", {
            status: response.status,
            body: responseBody,
          });
        });

        return response;
      },
    ],
  },
});
