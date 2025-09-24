import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import auth from "@react-native-firebase/auth";
import BootSplash from "react-native-bootsplash";

import { useUser } from "@/hooks";
import { User } from "@/hooks/domain/user/schema.ts";
import { UserQueryKey } from "@/hooks/domain/user/useUser.ts";

type AuthContextShape = {
  user: User | undefined;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape>({} as AuthContextShape);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { useFetchProfileQuery, invalidateQuery } = useUser();

  const [bootSplashHidden, setBootSplashHidden] = useState(false);

  const {
    data: profile,
    isLoading,
    isFetched,
    refetch,
  } = useFetchProfileQuery();

  useEffect(() => {
    if (!isFetched && !bootSplashHidden) {
      BootSplash.hide({ fade: true }).then(() => {
        console.log("BootSplash hidden");
        setBootSplashHidden(true);
      });
    }
  }, [isFetched]);

  const signInWithEmail = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email.trim(), password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email.trim(), password);
    await refetch();
  };

  const signOut = async () => {
    await Promise.all([
      invalidateQuery([UserQueryKey.fetchUserProfile]),
      auth().signOut(),
    ]);
  };

  const value: AuthContextShape = {
    user: profile,
    loading: isLoading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
