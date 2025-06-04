'use client'

import { useFirebaseAuth } from '@/hooks/use-firebase-auth'
import { Badge } from '@/components/ui/badge'

export function FirebaseAuthStatus() {
  const { firebaseUser, loading, error } = useFirebaseAuth()

  if (loading) {
    return <Badge variant='outline'>Loading Firebase auth...</Badge>
  }

  if (error) {
    return <Badge variant='destructive'>Firebase auth error</Badge>
  }

  if (firebaseUser) {
    return <Badge variant='default'>Firebase authenticated</Badge>
  }

  return <Badge variant='secondary'>Not authenticated with Firebase</Badge>
}
