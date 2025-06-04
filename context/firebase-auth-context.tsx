'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { type User, signInWithCustomToken, signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

interface FirebaseAuthContextType {
  firebaseUser: User | null;
  loading: boolean;
  error: Error | null;
  signOutFromFirebase: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  firebaseUser: null,
  loading: true,
  error: null,
  signOutFromFirebase: async () => {},
});

export function FirebaseAuthProvider({ children }: { children : React.ReactNode }) {
  const { userId, getToken, isLoaded: isClerkLoaded, isSignedIn } = useClerkAuth();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Sign out from firebase
  const signOutFromFirebase = async () => {
    try{
      await signOut(auth);
      setFirebaseUser(null);
    } catch(error){
      console.log('Error signing out from Firebase: ', error);
      setError(error as Error);
    }
  }

  // Sign in to Firebase with custom token
  const signInToFirebase = async () => {
    try{
      setLoading(true);
      setError(null);

      // Get custom token from API
      const response = await fetch('/api/firebase-token');

      if (!response.ok) {
        throw new Error(`Failed to get Firebase token: ${response.status} ${response.statusText}`);
      }

      const { token } = await response.json();

      if (!token) {
        throw new Error('No token returned from API');
      }

      // Sign in to Firebase with custom token
      const userCredential = await signInWithCustomToken(auth, token)
      setFirebaseUser(userCredential.user)
      console.log('Successfully signed in to Firebase with custom token')
    } catch(error) {
      console.error('Error signing in to Firebase:', error);
      setError(error as Error);
    } finally{
      setLoading(false);
    }
  }

  // Listen for Firebase auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, []);

  // Sign in to Firebase when Clerk user is signed in
  useEffect(() => {
    if (isClerkLoaded && isSignedIn && userId && !firebaseUser && !loading) {
      signInToFirebase()
    }
  }, [isClerkLoaded, isSignedIn, userId, firebaseUser, loading]);

  // Sign out from Firebase when Clerk user signs out
  useEffect(() => {
    if (isClerkLoaded && !isSignedIn && firebaseUser) {
      signOutFromFirebase()
    }
  }, [isClerkLoaded, isSignedIn, firebaseUser])

  return (
    <FirebaseAuthContext.Provider value={{ firebaseUser, loading, error, signOutFromFirebase }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export const useFirebaseAuth = () => useContext(FirebaseAuthContext)
