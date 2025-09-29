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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { UserQueryKey } from "@/hooks/domain/user/useUser.ts";

type AuthContextShape = {
  user: User | null;
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
  const { useFetchProfileQuery, invalidateQuery, setQueryData } = useUser();

  const [bootSplashHidden, setBootSplashHidden] = useState(false);
  const {
    data: profile,
    isLoading,
    isFetched,
    refetch,
  } = useFetchProfileQuery();

  useEffect(() => {
    if (isFetched && !bootSplashHidden) {
      setTimeout(() => {
        BootSplash.hide({ fade: true }).then(() => {
          setBootSplashHidden(true);
        });
      }, 300);
    }
  }, [isFetched]);

  const signInWithEmail = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email.trim(), password);
    await refetch();
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email.trim(), password);
    await refetch();
  };

  const signOut = async () => {
    await Promise.all([
      auth().signOut(),
      invalidateQuery([UserQueryKey.fetchUserProfile], { cancelRefetch: true }),
    ]);
    setQueryData(null);
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

    await refetch();
  };

  const value: AuthContextShape = {
    user: profile,
    loading: isLoading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
