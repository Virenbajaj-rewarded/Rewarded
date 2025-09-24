import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import auth, {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import BootSplash from "react-native-bootsplash";

import { useUser } from "@/hooks";
import { User } from "@/hooks/domain/user/schema.ts";
import { UserQueryKey } from "@/hooks/domain/user/useUser.ts";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

type AuthContextShape = {
  user: User | undefined;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape>({} as AuthContextShape);
export const useAuth = () => useContext(AuthContext);

//TODO Refactor this screen
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { useFetchProfileQuery, invalidateQuery } = useUser();

  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [bootSplashHidden, setBootSplashHidden] = useState(false);

  const {
    data: profile,
    isLoading,
    isPending,
    refetch,
  } = useFetchProfileQuery();

  useEffect(() => {
    if (!isPending && !isLoading && !bootSplashHidden) {
      setCurrentUser(profile);
      BootSplash.hide({ fade: true }).then(() => {
        console.log("BootSplash hidden");
        setBootSplashHidden(true);
      });
    }
  }, [isLoading, isPending]);

  const signInWithEmail = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email.trim(), password);
    const res = await refetch();

    setCurrentUser(res.data);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email.trim(), password);
    const res = await refetch();

    setCurrentUser(res.data);
  };

  const signOut = async () => {
    await Promise.all([
      invalidateQuery([UserQueryKey.fetchUserProfile]),
      auth().signOut(),
    ]);
    setCurrentUser(undefined);
  };

  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const signInResult = await GoogleSignin.signIn();

    let idToken = signInResult.data?.idToken;

    if (!idToken) {
      throw new Error("No ID token found");
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);

    await signInWithCredential(getAuth(), googleCredential);

    const res = await refetch();

    setCurrentUser(res.data);
  };

  const value: AuthContextShape = {
    user: currentUser,
    loading: isLoading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
