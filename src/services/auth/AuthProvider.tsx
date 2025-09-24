import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import BootSplash from "react-native-bootsplash";

import FirebaseUser = FirebaseAuthTypes.User;

type AuthContextShape = {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape>({} as AuthContextShape);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {};

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email.trim(), password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email.trim(), password);
  };

  const signOut = async () => {
    await auth().signOut();
  };

  const value: AuthContextShape = {
    user: firebaseUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
