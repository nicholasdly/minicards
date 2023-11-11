import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { api } from "~/trpc/server";

export default function Page() {
  return (
    <>
      <SignedOut>
        <SignedOutPage />
      </SignedOut>
      <SignedIn>
        <SignedInPage />
      </SignedIn>
    </>
  )
}

async function SignedInPage() {
  const decks = await api.deck.getAllUser.query();
  
  return (
    <main className="my-5 lg:my-8">
      <div className="flex flex-col px-5 lg:px-16 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">
            {decks.length > 0 ? "Your Decks" : "You have no decks!"}
          </h1>
          <Link href="/deck" className="btn normal-case">Create new deck</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
          {decks.map(deck => (
            <Link
              key={deck.id}
              href={`/deck/${deck.publicId}`}
              className="card bg-base-200 hover:bg-base-300 transition transition-300"
            >
              <div className="card-body">
                <h2 className="card-title">{deck.title}</h2>
                <div>
                  {/*
                    Having a line clamped element inside of an element of fixed height causes the line clamping to not
                    work as expected. Placing the below element inside of a div fixes this.
                  */}
                  <p>{deck.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function SignedOutPage() {
  return (
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
  );
}
