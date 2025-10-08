import { instance } from "@/services/instance";

import { balanceSchema, BalanceType, User, userSchema } from "./schema";

export const UserServices = {
  fetchProfile: async () => {
    const response = await instance.get<User>(`users/me`).json();
    return userSchema.parse(response);
  },
  fetchMerchantBalance: async () => {
    const response = await instance
      .get<BalanceType>(`merchants/balance`)
      .json();
    return balanceSchema.parse(response);
  },
  fetchCustomerBalance: async () => {
    console.log("Fetch");
    const response = await instance
      .get<BalanceType[]>(`users/me/balances`)
      .json();
    return response.map((balance) => balanceSchema.parse(balance));
  },
  fetchUserById: async (id: string) => {
    const response = await instance.get<User>(`users/${id}`).json();
    return userSchema.parse(response);
  },
};
