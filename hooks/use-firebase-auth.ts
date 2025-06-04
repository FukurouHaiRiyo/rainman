import { useFirebaseAuth as useFirebaseAuthContext } from '@/context/firebase-auth-context';

export function useFirebaseAuth() {
  return useFirebaseAuthContext()
}
