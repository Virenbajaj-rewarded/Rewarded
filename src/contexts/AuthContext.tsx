import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {auth} from '@/lib/firebase';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,} from 'firebase/auth';
import {api} from "@/lib/api.ts";

interface User {
    id: string;
    email: string;
    businessName: string;
    phone?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

// тип ответа /users/me (минимально)
type BackendMe = {
    id: string;
    email: string;
    role: 'USER' | 'MERCHANT' | 'ADMIN';
    phone?: string | null;
    // других полей может не быть
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // утилита маппинга backend -> фронтовый User
    const mapMeToUser = (me: BackendMe, fallback?: Partial<User>): User => ({
        id: me.id,
        email: me.email,
        businessName: fallback?.businessName ?? '', // фронту удобно иметь под руку
        phone: me.phone ?? fallback?.phone,
        address: fallback?.address,
    });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            try {
                if (!fbUser) {
                    setUser(null);
                    setIsLoading(false);
                    return;
                }
                try {
                    const { data } = await api.get<BackendMe>('/users/me');
                    setUser(mapMeToUser(data));
                } catch {
                    setUser({
                        id: fbUser.uid,
                        email: fbUser.email || '',
                        businessName: '',
                    });
                }
            } finally {
                setIsLoading(false);
            }
        });
        return () => unsub();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);

            try {
                const { data: me } = await api.get<BackendMe>('/users/me');
                setUser(mapMeToUser(me));
            } catch {
                setUser({
                    id: cred.user.uid,
                    email: cred.user.email || email,
                    businessName: '',
                });
            }

            return true;
        } catch (e) {
            console.error('Login error:', e);
            return false;
        }
    };

    const register = async (
        userData: Omit<User, 'id'> & { password: string }
    ): Promise<boolean> => {
        const { email, password, businessName, phone, address } = userData;

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await api.post('/auth/register');
            await api.post('/merchants', {
                businessName,
                businessEmail: email,
                businessPhoneNumber: phone || undefined,
                businessAddress: address || undefined,
            });

            try {
                const { data } = await api.get<BackendMe>('/users/me');
                setUser(mapMeToUser(data, { businessName, phone, address }));
            } catch {
                setUser({
                    id: cred.user.uid,
                    email,
                    businessName,
                    phone,
                    address,
                });
            }
            return true;
        } catch (e) {
            console.error('Registration error:', e);
            try { await signOut(auth); } catch(error) {
                console.log(error)
            }
            return false;
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
