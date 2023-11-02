import DeckFeed from "./_components/deck/deck-feed";
import { CreateDeckModal } from "./_components/deck/deck-create-modal";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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
      <main className="my-8">
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
        <div className="flex flex-col text-center font-bold max-w-3xl">
          <p className="text-3xl mb-10">minicards is being actively worked on.</p>
          <p>During development, your data may be lost.</p>
          <p>To report bugs or request a feature, make an issue on the&nbsp;
            <Link href="https://github.com/nicholasdly/minicards" className="link hover:text-secondary">
              minicards GitHub repository
            </Link>.
          </p>
        </div>
      </main>
    </SignedOut>
  );
}
