import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";

export default function Header() {
  const { userId } = auth();
  
  return (
    <header className="flex flex-col items-center mt-16">
      {userId
        ? <SignOutButton />
        : <SignInButton redirectUrl="/" />}
      <h1 className="text-6xl font-medium mb-6">queso</h1>
    </header>
  )
}