import { createContext } from 'react';
import type { User } from 'firebase/auth';

export type AuthContextType = {
    user: User | null;
    loading: boolean;

    signUp(email: string, pass: string): Promise<void>;
    signIn(email: string, pass: string): Promise<void>;
    signOutApp(): Promise<void>;
};

export const AuthCtx = createContext<AuthContextType | null>(null);
