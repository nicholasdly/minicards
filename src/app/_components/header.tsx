import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-5 py-4 border-b">
      <div className="flex-1 flex items-baseline gap-2">
        <Link href="/" className="text-3xl font-semibold">minicards</Link>
        <Link href="https://github.com/nicholasdly/minicards" className="badge badge-ghost">1.0.0</Link>
      </div>
      <div className="flex-none">
        <SignedIn>
          <UserButton
            signInUrl="/"
            afterSignOutUrl="/"
          />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="btn btn-ghost btn-sm normal-case">log in or sign up</button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}