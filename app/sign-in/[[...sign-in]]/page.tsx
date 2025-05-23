import { SignIn } from "@clerk/nextjs";
import './page.css';

export default function SignInPage() {
  return (
    <div className='flex'>
      <div className='background-container'>
        <img
          className='responsive-image  rounded-2xl ml-1 mr-2 pr-2'
          src='/GreatBlue.png'
          alt='Background'
        />
      </div>

      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
