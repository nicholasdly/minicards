import DeckFeed from "./_components/deck/deck-feed";
import { CreateDeckModal } from "./_components/deck/deck-create-modal";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <SignedOutPage />
      <SignedInPage />
    </>
  )
}

function SignedInPage() {
  return (
    <SignedIn>
      <main className="my-5 lg:my-8">
        <DeckFeed />
        <CreateDeckModal />
      </main>
    </SignedIn>
  );
}

function SignedOutPage() {
  return (
    <SignedOut>
      <main className="flex justify-center mt-32">
        <div className="flex flex-col text-center max-w-3xl">
          <p className="text-5xl font-semibold">minicards</p>
          <p className="text-xl mb-10">online flashcards simplified</p>
          <p className="text-2xl">free to use ✅</p>
          <p className="text-2xl">fast and simple 🔥</p>
          <p className="text-2xl">open source 👨🏽‍💻</p>
          <p className="text-2xl mb-10">no ads 🔕</p>
        </div>
      </main>
    </SignedOut>
  );
}
