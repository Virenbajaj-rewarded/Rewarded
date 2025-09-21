import { instance } from "@/services/instance";

import { userSchema } from "./schema";

export const UserServices = {
  fetchСurrentProfile: async () => {
    const response = await instance.get(`users/me`).json();
    return userSchema.parse(response);
  },
};
