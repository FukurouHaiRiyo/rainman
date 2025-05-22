import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { User, signInWithEmailAndPassword as _signInWithEmailAndPassword, signOut as _signOut } from 'firebase/auth';
import { onAuthStateChanged as _onAuthStateChanged } from 'firebase/auth';

interface AuthUser {
    uid: string;
    email: string | null;
}

const formatAuthUser = (user: User): AuthUser => ({
    uid: user.uid, 
    email: user.email
});

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const authStateChanged = async(authState: User | null) => {
        if (!authState) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const formattedUser = formatAuthUser(authState);
        setAuthUser(formattedUser);

        setLoading(false);
    };

    const clear = () => {
        setAuthUser(null);
        setLoading(true);
    }

    const signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
        await _signInWithEmailAndPassword(auth, email, password);
    }

    const signOut = async (): Promise<void> => {
        await _signOut(auth).then(clear);
    }

    const onAuthStateChanged = (cb: (user: User | null) => void) => {
        return _onAuthStateChanged(auth, cb);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        loading,
        signInWithEmailAndPassword,
        signOut
    }
}