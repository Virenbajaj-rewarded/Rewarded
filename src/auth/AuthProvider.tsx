import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { AuthCtx, type AuthContextType } from './AuthContext';
import { api } from '../api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthContextType['user']>(auth.currentUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const signUp = async (email: string, pass: string) => {
        await createUserWithEmailAndPassword(auth, email, pass);
        await api.post('/auth/register').catch(() => {});
    };

    const signIn = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
        await api.post('/auth/register').catch(() => {});
    };

    const signOutApp = async () => {
        await signOut(auth);
    };

    const value = useMemo<AuthContextType>(
        () => ({ user, loading, signUp, signIn, signOutApp }),
        [user, loading]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};
