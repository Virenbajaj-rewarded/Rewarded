import { instance } from "@/services/instance";

import { User, userSchema } from "./schema";

export const UserServices = {
  fetchProfile: async () => {
    console.log("Fetch");
    const response = await instance.get<User>(`users/me`).json();
    return userSchema.parse(response);
  },
};
