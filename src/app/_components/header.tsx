import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-5 py-4 border-b">
      <div className="flex-1 flex items-baseline gap-2">
        <Link href="/" className="text-3xl font-semibold">minicards</Link>
        <span className="text-sm">
          by&nbsp;
          <Link href="https://www.nicholasly.com/" target="_blank" prefetch={false}>
            Nicholas Ly
          </Link>
        </span>
      </div>
      <div className="flex-none">
        <SignedIn>
          <UserButton
            showName={true}
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