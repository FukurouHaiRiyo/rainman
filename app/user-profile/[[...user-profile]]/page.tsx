import { UserProfile } from "@clerk/nextjs"

export default function UserProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <UserProfile
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        routing="path"
        path="/user-profile"
      />
    </div>
  )
}
