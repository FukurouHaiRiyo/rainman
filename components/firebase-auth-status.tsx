'use client'

import { useFirebaseAuth } from '@/hooks/use-firebase-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function FirebaseAuthStatus() {
  const { firebaseUser, loading, error, retrySignIn } = useFirebaseAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className='mb-4'>
      <CardHeader>
        <CardTitle className='text-sm'>Firebase Auth Status (Dev Only)</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>Status:</span>
          {loading ? (
            <Badge variant='secondary'>Loading...</Badge>
          ) : firebaseUser ? (
            <Badge variant='default'>Authenticated</Badge>
          ) : (
            <Badge variant='destructive'>Not Authenticated</Badge>
          )}
        </div>

        {firebaseUser && <div className='text-xs text-muted-foreground'>Firebase UID: {firebaseUser.uid}</div>}

        {error && (
          <div className='space-y-2'>
            <div className='text-xs text-red-600'>Error: {error.message}</div>
            <Button size='sm' onClick={retrySignIn}>
              Retry Firebase Sign-in
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
