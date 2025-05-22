import { createContext, useContext, ReactNode } from 'react';
import useFirebaseAuth from '@/app/lib/useFirebaseAuth';

interface AuthContextType {
    authUser: {uid: string, email: string | null } | null;
    loading: boolean;
    signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const authUserContext = createContext<AuthContextType>({
    authUser: null,
    loading: true,
    signInWithEmailAndPassword: async () => {},
    signOut: async () => {}

});

interface AuthUserProviderProps {
    children: ReactNode;
}

export function AuthUserProvider({ children }: AuthUserProviderProps) {
    const auth = useFirebaseAuth();
    return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);