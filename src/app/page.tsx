import DeckFeed from "./_components/deck/deck-feed";
import { CreateDeckModal } from "./_components/deck/deck-create";
import { SignedIn, SignedOut } from "@clerk/nextjs";

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
      <main>
        <DeckFeed />
        <CreateDeckModal />
      </main>
    </SignedIn>
  );
}

function SignedOutPage() {
  return (
    <SignedOut>
      <main className="flex justify-center mt-32 font-bold">
        Hello world!
      </main>
    </SignedOut>
  );
}
