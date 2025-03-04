'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/app/context/AuthUserContext';
import { toast } from '@/hooks/use-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signInWithEmailAndPassword } = useAuth();

  const handleSignIn = async(event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try{
      await signInWithEmailAndPassword(email, password);
      router.push('/Admin');
    } catch(err: any){
      setError(err.message);
      toast({
        title: 'Eroare',
        description: 'A aparut o eroare la logare. Incearca din nou',
        variant: 'destructive'
      });
    }
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img src='/rain.svg' alt='image' />
      </div>

      <div className='bg-gray-800 flex flex-col justify-center'>
        <form onSubmit={handleSignIn} className='max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8'>
          <h2 className='text-4xl dark:text-white font-bold text-center'> Sign in </h2>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <div className='flex flex-col text-gray-400 py-2'>
            <label> Username/email </label>
            <input 
              className='rounded-lg bg-gray-700 mt-2 p-2 focus:boder-blue-500 focus:bg-gray-800 focus:outline-none' 
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col text-gray-400 py-2'>
            <label>Password</label>
            <input 
              className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' 
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}  
            />
          </div>

          <button className='w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>SIGNIN</button>
        </form>
      </div>
    </div>
  )
}

export default SignIn;